"use client"

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getCoordinates, Coordinates } from '@/utils/gMaps/geocode';

const containerStyle = {
  width: '100%',
  height: '300px',
  maxWidth: '100%',       // Set the max width to full to occupy half of the screen in flexbox
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

interface MapProps {
  address: string;
}

const Location_Map: React.FC<MapProps> = ({ address }) => {
  const [center, setCenter] = useState<Coordinates | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        console.log('HERE')
        const coordinates = await getCoordinates(address);
        setCenter(coordinates);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoordinates();
  }, [address]);

  if (!center) {
    return (
      <p>
        Loading Map...
      </p>
    );
  }

  return (
    <div className='mb-12 p-8'>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} >
        <div className='flex flex-wrap'>
          <div className='w-full md:w-1/2 p-4'>
            <h2 className='text-2xl font-bold mb-4'>We are located off Stockton Boulevard and Orange Avenue!</h2>
            <p className='text-lg'>
              Come visit us at our store! We are located at {" "}
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=6611+Orange+Ave+suite+d,+Sacramento,+CA+95823" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-800"
              >
                6611 Orange Ave suite d, Sacramento, CA 95823
              </a>
            </p>
          </div>
          <div className='w-full md:w-1/2 p-4'>
            <GoogleMap 
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          </div>
        </div>
      </LoadScript>
    </div>
  )
}

export default Location_Map;
