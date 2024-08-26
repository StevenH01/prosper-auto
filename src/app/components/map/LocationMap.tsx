"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { getCoordinates, Coordinates } from "@/utils/gMaps/geocode";

const containerStyle = {
  width: "100%",
  height: "300px",
  maxWidth: "100%",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

interface MapProps {
  address: string;
}

export const LocationMap: React.FC<MapProps> = ({ address }) => {
  const [center, setCenter] = useState<Coordinates | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        console.log("HERE");
        const coordinates = await getCoordinates(address);
        setCenter(coordinates);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoordinates();
  }, [address]);

  if (!center) {
    return <p>Loading Map...</p>;
  }

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
