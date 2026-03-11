"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018];

function SetViewOnChange({
  center,
  zoom = 16,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.6 } as L.ZoomPanOptions);
  }, [center[0], center[1], zoom, map]);
  return null;
}

interface AddressMapPickerProps {
  latitude?: number;
  longitude?: number;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function AddressMapPicker({
  latitude,
  longitude,
  onPositionChange,
}: AddressMapPickerProps) {
  const [iconReady, setIconReady] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
    setIconReady(true);
  }, []);

  const position = useMemo((): [number, number] => {
    if (
      latitude != null &&
      longitude != null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      return [latitude, longitude];
    }
    return DEFAULT_CENTER;
  }, [latitude, longitude]);

  const handleDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      const m = e.target as L.Marker;
      const { lat, lng } = m.getLatLng();
      onPositionChange(lat, lng);
    },
    [onPositionChange],
  );

  if (!iconReady) {
    return (
      <div className="w-full h-[280px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
        กำลังโหลดแผนที่...
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <p className="text-sm text-gray-600">
        ลากหมุดไปยังตำแหน่งที่อยู่จริงของคุณ
      </p>
      <div className="w-full h-[280px] rounded-lg overflow-hidden border border-gray-200 [&_.leaflet-container]:h-full">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom
          className="h-[280px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SetViewOnChange center={position} zoom={16} />
          <Marker
            key={position[0].toFixed(6) + "," + position[1].toFixed(6)}
            position={position}
            draggable
            eventHandlers={{ dragend: handleDragEnd }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
