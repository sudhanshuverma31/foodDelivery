import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/locationSlice/location';

function useGetCity() {
  const dispatch = useDispatch();
  console.log("ego>>>>>>")
  useEffect(() => {
    const defaultLocation = { city: 'Delhi' };

    const fetchCityByCoords = async (lat, lng) => {
      const apiKey = import.meta.env.VITE_GEOAPIKEY;
      console.log("time......")

      try {
        let city = 'Delhi';
        console.log("hi......")
        if (apiKey) {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
          );
          const data = await response.json();
          console.log("location ", data);
          city = data.results?.[0]?.city || data.results?.[0]?.county || 'Delhi';
        } else {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          city = data.address?.city || data.address?.town || data.address?.village || 'Delhi';
        }

        dispatch(setLocation({ city, lat, lng }));
      } catch (error) {
        console.error('Failed to fetch location:', error);
        dispatch(setLocation({ ...defaultLocation, lat, lng }));
      }
    };

    if (!navigator.geolocation) {
      dispatch(setLocation(defaultLocation));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
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
  }, []);
}

export default useGetCity;
