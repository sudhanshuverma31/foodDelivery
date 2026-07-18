import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FaUtensils } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOwnerShopData } from '../redux/shopSlice/ownerShopSlice';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function EditShop() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const shopCreateHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('address', address);
    formData.append('description', `${name} restaurant`);
    formData.append('category', 'Fast Food');

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/shops/create-shop',
        formData,
        {
          withCredentials: true,
        }
      );
        
      dispatch(setOwnerShopData(response.data));
      navigate('/owner-dashboard')
    } catch (error) {
      console.error('Failed to create shop:', error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] ?? null);
  };

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <div className="flex items-center justify-center flex-col bg-white rounded-2xl shadow-xl p-4 mt-20">
        <FaUtensils className="text-[#ff4d2d]" size={40} />
        <h1 className="text-bold p-2 font-bold ">Add Shop</h1>

        <form className="space-y-3" onSubmit={shopCreateHandle}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Shop Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Shop image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Shop Address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="bg-[#ff4d2d] text-white p-2 mt-3 rounded-xl w-full cursor-pointer"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditShop;