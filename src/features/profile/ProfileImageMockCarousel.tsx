import React, { useState } from 'react';
import {
  Bird,
  Cat,
  ChevronLeft,
  ChevronRight,
  Dog,
  Fish,
  Rabbit,
  X,
} from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

type MockKey = 'cat' | 'dog' | 'fish' | 'bird' | 'rabbit';

type ProfileImageMockCarouselProps = {
  avatarUrl: string | null;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  isEditOpen: boolean;
  onRequestOpenEditor: () => void;
  onRequestCloseEditor: () => void;
  onRemovePreview: () => void;
};

export default function ProfileImageMockCarousel({
  avatarUrl,
  previewUrl,
  setPreviewUrl,
  setSelectedFile,
  onRequestOpenEditor,
  onRequestCloseEditor,
  onRemovePreview,
}: ProfileImageMockCarouselProps) {
  const mockKeys = ['cat', 'dog', 'fish', 'bird', 'rabbit'] as const;
  type Key = (typeof mockKeys)[number];

  const [mockIndex, setMockIndex] = useState<number>(0);
  const [isGeneratingMock, setIsGeneratingMock] = useState(false);

  const svgToPngFile = async (svg: string, fileName: string) => {
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const canvas = document.createElement('canvas');
    const out = 512;
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.drawImage(img, 0, 0, out, out);

    const blob: Blob | null = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png');
    });
    if (!blob) throw new Error('Failed to generate mock avatar PNG');

    return new File([blob], fileName, { type: 'image/png' });
  };

  const applyMockAvatar = async (key: Key) => {
    if (isGeneratingMock) return;
    setIsGeneratingMock(true);
    try {
      const iconSize = 248; // pixels
      const iconPos = (512 - iconSize) / 2;

      const configByKey: Record<
        Key,
        {
          bg1: string;
          bg2: string;
          accent: string;
          icon: React.ReactElement;
          fileName: string;
        }
      > = {
        cat: {
          bg1: '#A78BFA',
          bg2: '#EC4899',
          accent: '#F472B6',
          icon: <Cat size={iconSize} color="#0B1220" strokeWidth={3} />,
          fileName: 'mock-cat.png',
        },
        dog: {
          bg1: '#F59E0B',
          bg2: '#F43F5E',
          accent: '#FB7185',
          icon: <Dog size={iconSize} color="#0B1220" strokeWidth={3} />,
          fileName: 'mock-dog.png',
        },
        fish: {
          bg1: '#22C55E',
          bg2: '#06B6D4',
          accent: '#2DD4BF',
          icon: <Fish size={iconSize} color="#0B1220" strokeWidth={3} />,
          fileName: 'mock-fish.png',
        },
        bird: {
          bg1: '#60A5FA',
          bg2: '#FDE68A',
          accent: '#FBBF24',
          icon: <Bird size={iconSize} color="#0B1220" strokeWidth={3} />,
          fileName: 'mock-bird.png',
        },
        rabbit: {
          bg1: '#8B5CF6',
          bg2: '#38BDF8',
          accent: '#93C5FD',
          icon: <Rabbit size={iconSize} color="#0B1220" strokeWidth={3} />,
          fileName: 'mock-rabbit.png',
        },
      };

      const cfg = configByKey[key];

      // Build an SVG (rounded background + lucide animal icon) then convert to PNG.
      // We position the lucide icon SVG by injecting x/y on its root <svg>.
      const iconSvg = renderToStaticMarkup(cfg.icon);
      const iconSvgPos = iconSvg.replace('<svg ', `<svg x="${iconPos}" y="${iconPos}" `);

      const animalSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
          <defs>
            <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stop-color="${cfg.bg1}"/>
              <stop offset="1" stop-color="${cfg.bg2}"/>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <rect width="512" height="512" rx="64" fill="url(#bg)"/>
          <circle cx="150" cy="130" r="22" fill="${cfg.accent}" opacity="0.65"/>
          <circle cx="390" cy="200" r="28" fill="${cfg.accent}" opacity="0.55"/>
          <circle cx="120" cy="340" r="18" fill="#FFFFFF" opacity="0.22"/>
          <circle cx="420" cy="390" r="22" fill="#FFFFFF" opacity="0.18"/>
          <g filter="url(#shadow)">
            <circle cx="256" cy="270" r="185" fill="#FFFFFF" opacity="0.14"/>
          </g>
          ${iconSvgPos}
        </svg>
      `;

      const file = await svgToPngFile(animalSvg, cfg.fileName);

      const oldPreviewUrl = previewUrl;
      if (oldPreviewUrl) URL.revokeObjectURL(oldPreviewUrl);

      onRequestCloseEditor();

      setSelectedFile(file);
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
    } finally {
      setIsGeneratingMock(false);
    }
  };

  const handleMockPrev = async () => {
    const next = (mockIndex - 1 + mockKeys.length) % mockKeys.length;
    setMockIndex(next);
    await applyMockAvatar(mockKeys[next]);
  };

  const handleMockNext = async () => {
    const next = (mockIndex + 1) % mockKeys.length;
    setMockIndex(next);
    await applyMockAvatar(mockKeys[next]);
  };

  return (
    <div className="w-48 h-48 rounded-full bg-utility-white border border-gray-200 overflow-visible relative mb-4">
      {/* Clip only the image/contents to the circle; arrows can overflow outside */}
      <div className="absolute inset-px rounded-full overflow-hidden flex items-center justify-center">
        {previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePreview();
            }}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
            aria-label="ลบรูปภาพที่เลือก"
          >
            <X size={16} />
          </button>
        )}

        {previewUrl || avatarUrl ? (
          <div
            className={`w-full h-full overflow-hidden relative ${
              previewUrl ? 'cursor-pointer' : ''
            }`}
            onClick={() => {
              if (!previewUrl) return;
              onRequestOpenEditor();
            }}
            role={previewUrl ? 'button' : undefined}
            aria-label={previewUrl ? 'แก้ไขรูปภาพ' : undefined}
          >
            <img
              src={previewUrl || avatarUrl || undefined}
              alt="Profile"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <i className="fa-solid fa-image text-3xl mb-2"></i>
            <span className="text-sm">ไม่มีรูปภาพ</span>
          </div>
        )}
      </div>

      {/* LINE-like left/right mock avatar arrows */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void handleMockPrev();
        }}
        disabled={isGeneratingMock}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-50"
        aria-label="เลือกหน้าโปรไฟล์ก่อนหน้า"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void handleMockNext();
        }}
        disabled={isGeneratingMock}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer disabled:opacity-50"
        aria-label="เลือกหน้าโปรไฟล์ถัดไป"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

