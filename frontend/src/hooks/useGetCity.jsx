import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/locationSlice/location';

function useGetCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    const defaultLocation = { city: 'Delhi' };

    const fetchCityByCoords = async (lat, lng) => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        dispatch(setLocation({ ...defaultLocation, lat, lng }));
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();

        const place = data.results?.find((result) => result.types?.includes('locality'))
          ?? data.results?.[0];

        dispatch(
          setLocation({
            city: place?.formatted_address ?? 'Delhi',
            lat,
            lng,
          })
        );
      } catch (error) {
        console.error('Failed to fetch location from Google:', error);
        dispatch(setLocation({ ...defaultLocation, lat, lng }));
      }
    };

    if (!navigator.geolocation) {
      dispatch(setLocation(defaultLocation));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCityByCoords(latitude, longitude);
      },
      () => {
        dispatch(setLocation(defaultLocation));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, [dispatch]);
}

export default useGetCity;
