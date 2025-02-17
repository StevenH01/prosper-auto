export interface Coordinates {
  lat: number;
  lng: number;
}

export async function getCoordinates(address: string): Promise<Coordinates> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );
  const data = await response.json();

  console.log("Geocoding API Response:", data); // Add this line

  if (data.status === "OK") {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } else {
    throw new Error(`Geocoding failed: ${data.status}`);
  }
}
