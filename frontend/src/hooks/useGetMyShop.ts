import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setOwnerShopData } from '../redux/shopSlice/ownerShopSlice';

function useGetMyShop() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shops/get-shop', {
          withCredentials: true,
        });

        dispatch(setOwnerShopData(response.data));
      } catch (error) {
        console.error('Failed to fetch shop:', error);
      }
    };

    fetchShop();
  }, []);
}

export default useGetMyShop;