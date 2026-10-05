"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getCoordinates, type Coordinates } from "@/utils/gMaps/geocode";

/** Near-black land, charcoal roads and a faint red tint on highways, with no business clutter, to match the site. */
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#71717a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0d0d" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.neighborhood", elementType: "labels.text.fill", stylers: [{ color: "#52525b" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#101411" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#232323" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0d0d0d" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7c7c85" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#333333" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3f1a1d" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1a0a0b" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#a1a1aa" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050505" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3f3f46" }] },
];

const MAP_OPTIONS: google.maps.MapOptions = {
  styles: MAP_STYLE,
  disableDefaultUI: true, // our own zoom buttons replace the white default controls
  clickableIcons: false,
  gestureHandling: "cooperative", // on a phone, one finger scrolls the page instead of getting stuck in the map
  backgroundColor: "#0d0d0d", // no white flash while tiles load
  minZoom: 11,
  maxZoom: 19,
};

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="54" viewBox="0 0 40 54"><defs><filter id="s" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity="0.6"/></filter></defs><path filter="url(#s)" d="M20 2C10.6 2 3 9.4 3 18.6 3 30.5 20 50 20 50s17-19.5 17-31.4C37 9.4 29.4 2 20 2z" fill="#dc2626" stroke="#fff" stroke-width="2.5"/><circle cx="20" cy="18.5" r="6.5" fill="#fff"/></svg>`;
const PIN_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PIN_SVG)}`;

const RING = { fillColor: "#dc2626", fillOpacity: 0.1, strokeColor: "#dc2626", strokeOpacity: 0.45, strokeWeight: 1, clickable: false };

interface MapProps {
  address: string;
  /** The shop's coordinates. Pass them to skip looking the address up on every visit. */
  position?: Coordinates;
}

const btn =
  "flex h-9 w-9 items-center justify-center border border-white/15 bg-black/70 text-lg leading-none text-white backdrop-blur-sm transition-colors hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500";

export const LocationMap: React.FC<MapProps> = ({ address, position }) => {
  const [coords, setCoords] = useState<Coordinates | null>(position ?? null);
  const [lookupFailed, setLookupFailed] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({ id: "prosper-map", googleMapsApiKey: apiKey });

  useEffect(() => {
    if (position) {
      setCoords(position);
      return;
    }
    let cancelled = false;
    getCoordinates(address)
      .then((c) => !cancelled && setCoords(c))
      .catch((error) => {
        console.error(error);
        if (!cancelled) setLookupFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [address, position?.lat, position?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  const icon = useMemo(
    () => (isLoaded ? { url: PIN_URL, scaledSize: new google.maps.Size(40, 54), anchor: new google.maps.Point(20, 50) } : undefined),
    [isLoaded],
  );

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const zoom = (delta: number) => {
    const map = mapRef.current;
    if (map) map.setZoom((map.getZoom() ?? 15) + delta);
  };

  // If the map can't load, still give people a way to find the shop.
  if (loadError || lookupFailed || !apiKey) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 bg-[#0d0d0d] p-8 text-center">
        <p className="text-sm text-zinc-400">{address}</p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-700"
        >
          Get Directions
        </a>
      </div>
    );
  }

  if (!isLoaded || !coords) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center bg-[#0d0d0d]" role="status">
        <span className="animate-pulse text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Loading map</span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[300px] w-full bg-[#0d0d0d]" role="region" aria-label="Map showing Prosper Auto Werks">
      <GoogleMap
        mapContainerClassName="absolute inset-0"
        center={coords}
        zoom={15}
        options={MAP_OPTIONS}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
      >
        <Circle center={coords} radius={140} options={RING} />
        <Marker position={coords} icon={icon} title="Prosper Auto Werks" />
      </GoogleMap>

      {/* Name and directions, top left */}
      <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
        <div className="pointer-events-none flex items-center gap-3 bg-black/70 px-3 py-2 backdrop-blur-sm">
          <span className="h-px w-5 bg-red-600" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">Prosper Auto Werks</span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          Get Directions →
        </a>
      </div>

      {/* Zoom, top right */}
      <div className="absolute right-4 top-4 flex flex-col gap-px">
        <button type="button" onClick={() => zoom(1)} className={btn} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => zoom(-1)} className={btn} aria-label="Zoom out">
          −
        </button>
      </div>
    </div>
  );
};
