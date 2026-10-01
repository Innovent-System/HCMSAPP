// hooks/useCurrentLocation.js
import { useState } from 'react';

const ERROR_MESSAGES = {
  1: 'Location access denied. Please allow location permission.',
  2: 'Location is unavailable. Please try again.',
  3: 'Location request timed out. Please try again.',
};

const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0, // cached location nahi, hamesha fresh
};

export default function useCurrentLocation(options = {}) {
  const [location, setLocation] = useState(null); // { latitude, longitude, accuracy }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Promise return karta hai, taake caller await karke direct use kar sake
  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        const msg = 'Location is not supported on this device.';
        setError(msg);
        return reject(new Error(msg));
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        ({ coords, timestamp }) => {
          const result = {
            latitude: +coords.latitude.toFixed(6),
            longitude: +coords.longitude.toFixed(6),
            accuracy: Math.round(coords.accuracy),
            timestamp,
          };
          setLocation(result);
          setLoading(false);
          resolve(result);
        },
        (err) => {
          const msg = ERROR_MESSAGES[err.code] ?? 'Unable to get location.';
          setError(msg);
          setLoading(false);
          reject(new Error(msg));
        },
        { ...DEFAULT_OPTIONS, ...options }
      );
    });

  return { location, loading, error, getLocation };
}