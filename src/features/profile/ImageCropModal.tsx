import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error';
type ShowToastFn = (message: string, type: ToastType) => void;

type ImageCropModalProps = {
  previewUrl: string;
  selectedFile: File;
  onClose: () => void;
  onCropped: (croppedFile: File, newPreviewUrl: string) => void;
  showToast: ShowToastFn;
};

export default function ImageCropModal({
  previewUrl,
  selectedFile,
  onClose,
  onCropped,
  showToast,
}: ImageCropModalProps) {
  const cropBoxRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Crop editor state
  const [editZoom, setEditZoom] = useState(1);
  const [editPan, setEditPan] = useState({ x: 0, y: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [cropSize, setCropSize] = useState(0);
  const [isCropping, setIsCropping] = useState(false);

  // Reset editor state when modal opens / target changes.
  useEffect(() => {
    setEditZoom(1);
    setEditPan({ x: 0, y: 0 });
    setImgNaturalSize(null);
    setCropSize(0);
    setIsCropping(false);
  }, [previewUrl]);

  // Measure crop box size when editor opens.
  useEffect(() => {
    const update = () => {
      if (!cropBoxRef.current) return;
      setCropSize(cropBoxRef.current.clientWidth);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Load image natural size for accurate canvas crop mapping.
  useEffect(() => {
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      setImgNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => setImgNaturalSize(null);
  }, [previewUrl]);

  const zoomIn = () => setEditZoom((z) => Math.min(3, Math.round((z + 0.1) * 10) / 10));
  const zoomOut = () => setEditZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10));

  // Clamp pan whenever zoom changes to avoid jump back to corners.
  useEffect(() => {
    if (!imgNaturalSize || cropSize <= 0) return;
    const baseScale = Math.max(
      cropSize / imgNaturalSize.width,
      cropSize / imgNaturalSize.height,
    );
    const dispWz = imgNaturalSize.width * baseScale * editZoom;
    const dispHz = imgNaturalSize.height * baseScale * editZoom;
    const maxX = Math.max(0, (dispWz - cropSize) / 2);
    const maxY = Math.max(0, (dispHz - cropSize) / 2);

    setEditPan((p) => ({
      x: Math.max(-maxX, Math.min(maxX, p.x)),
      y: Math.max(-maxY, Math.min(maxY, p.y)),
    }));
  }, [editZoom, imgNaturalSize, cropSize]);

  const handleCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imgNaturalSize || cropSize <= 0) return;
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...editPan };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCropPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    // Ignore stray move events after mouse/pointer release.
    if (e.buttons !== 1) return;
    if (!imgNaturalSize || cropSize <= 0) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const nextX = panStartRef.current.x + dx;
    const nextY = panStartRef.current.y + dy;

    const baseScale = Math.max(
      cropSize / imgNaturalSize.width,
      cropSize / imgNaturalSize.height,
    );
    const dispWz = imgNaturalSize.width * baseScale * editZoom;
    const dispHz = imgNaturalSize.height * baseScale * editZoom;
    const maxX = Math.max(0, (dispWz - cropSize) / 2);
    const maxY = Math.max(0, (dispHz - cropSize) / 2);

    const clampedX = Math.max(-maxX, Math.min(maxX, nextX));
    const clampedY = Math.max(-maxY, Math.min(maxY, nextY));

    setEditPan({ x: clampedX, y: clampedY });
  };

  const handleCropPointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleConfirmCrop = async () => {
    if (!previewUrl || !imgNaturalSize || cropSize <= 0) return;
    setIsCropping(true);
    const oldPreviewUrl = previewUrl;

    try {
      const img = new Image();
      img.src = previewUrl;
      await img.decode();

      const baseScale = Math.max(
        cropSize / imgNaturalSize.width,
        cropSize / imgNaturalSize.height,
      );

      const scaled = baseScale * editZoom;
      const cropCenter = cropSize / 2;
      const dispW0 = imgNaturalSize.width * baseScale;
      const dispH0 = imgNaturalSize.height * baseScale;
      const dispWz = dispW0 * editZoom;
      const dispHz = dispH0 * editZoom;

      // top-left position of the scaled "cover" image in crop box coordinates
      const topLeftX = cropCenter - dispWz / 2 + editPan.x;
      const topLeftY = cropCenter - dispHz / 2 + editPan.y;

      const srcX = (0 - topLeftX) / scaled;
      const srcY = (0 - topLeftY) / scaled;
      const srcW = cropSize / scaled;
      const srcH = cropSize / scaled;

      const maxX = Math.max(0, imgNaturalSize.width - srcW);
      const maxY = Math.max(0, imgNaturalSize.height - srcH);
      const clampedX = Math.max(0, Math.min(maxX, srcX));
      const clampedY = Math.max(0, Math.min(maxY, srcY));

      const outSize = 256;
      const canvas = document.createElement('canvas');
      canvas.width = outSize;
      canvas.height = outSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, outSize, outSize);
      ctx.drawImage(img, clampedX, clampedY, srcW, srcH, 0, 0, outSize, outSize);

      const mime = selectedFile.type || 'image/jpeg';
      const blob: Blob | null = await new Promise((resolve) => {
        const quality =
          mime.includes('jpeg') || mime.includes('webp') ? 0.92 : undefined;
        canvas.toBlob((b) => resolve(b), mime, quality as any);
      });

      if (!blob) throw new Error('Failed to crop image');

      const newUrl = URL.createObjectURL(blob);
      const croppedFile = new File([blob], selectedFile.name, { type: blob.type });

      onCropped(croppedFile, newUrl);
      onClose();

      // previewUrl is always an object URL; safe to revoke after replacement.
      URL.revokeObjectURL(oldPreviewUrl);
    } catch (e: any) {
      showToast('เกิดข้อผิดพลาดในการครอปรูปภาพ: ' + (e?.message ?? ''), 'error');
    } finally {
      setIsCropping(false);
    }
  };

  const editBaseScale =
    imgNaturalSize && cropSize > 0
      ? Math.max(cropSize / imgNaturalSize.width, cropSize / imgNaturalSize.height)
      : 1;
  const editDispW0 = imgNaturalSize ? imgNaturalSize.width * editBaseScale : 0;
  const editDispH0 = imgNaturalSize ? imgNaturalSize.height * editBaseScale : 0;
  const editDispWz = editDispW0 * editZoom;
  const editDispHz = editDispH0 * editZoom;

  // When we render using CSS transform scale(), the top-left position must be based on base-size.
  const editLeft0 = cropSize > 0 ? cropSize / 2 - editDispW0 / 2 + editPan.x : 0;
  const editTop0 = cropSize > 0 ? cropSize / 2 - editDispH0 / 2 + editPan.y : 0;

  return (
    <div
      className="fixed inset-0 z-1000 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">แก้ไขรูปภาพ</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="ปิดหน้าต่างแก้ไขรูปภาพ"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div
            ref={cropBoxRef}
            className="relative mx-auto w-[320px] h-[320px] max-w-[80vw] max-h-[60vh] overflow-hidden rounded-xl bg-black/5 touch-none select-none cursor-grab"
            onPointerDown={handleCropPointerDown}
            onPointerMove={handleCropPointerMove}
            onPointerUp={handleCropPointerUp}
            onPointerCancel={handleCropPointerUp}
          >
            {imgNaturalSize && cropSize > 0 ? (
              <img
                src={previewUrl}
                alt="Crop target"
                draggable={false}
                className="absolute"
                style={{
                  left: `${editLeft0}px`,
                  top: `${editTop0}px`,
                  width: `${editDispW0}px`,
                  height: `${editDispH0}px`,
                  transform: `scale(${editZoom})`,
                  transformOrigin: 'center',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                กำลังโหลดรูป...
              </div>
            )}

            {/* Crop border guide */}
            <div className="absolute inset-0 border-2 border-white rounded-xl pointer-events-none" />
          </div>

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={zoomOut}
              className="btn-secondary px-4 py-2 rounded-lg text-sm cursor-pointer"
              aria-label="ซูมออก"
            >
              -
            </button>
            <span className="text-sm font-medium text-gray-700 w-[70px] text-center">
              {Math.round(editZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="btn-secondary px-4 py-2 rounded-lg text-sm cursor-pointer"
              aria-label="ซูมเข้า"
            >
              +
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setEditZoom(1);
                setEditPan({ x: 0, y: 0 });
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              รีเซ็ต
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isCropping}
              className="btn-secondary w-full px-6 py-3 rounded-lg text-sm cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={isCropping}
              className="btn-primary w-full px-6 py-3 rounded-lg text-sm cursor-pointer"
            >
              {isCropping ? 'กำลังครอป...' : 'ยืนยัน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

