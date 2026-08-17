import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { FaUtensils } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOwnerShopData } from '../redux/shopSlice/ownerShopSlice';
import { useNavigate } from "react-router-dom";

export default function EditShop() {
  const ownerShop = useSelector((state: any) => state.owner.ownerShopData);

  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (ownerShop) {
      setName(ownerShop.name || '');
      setCity(ownerShop.city || '');
      setState(ownerShop.state || '');
      setAddress(ownerShop.address || '');
    }
  }, [ownerShop]);

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
      const url = ownerShop
        ? 'http://localhost:5000/api/shops/update-shop'
        : 'http://localhost:5000/api/shops/create-shop';

      const response = await axios({
        method: ownerShop ? 'put' : 'post',
        url: url,
        data: formData,
        withCredentials: true,
      });

      dispatch(setOwnerShopData(response.data));
      navigate('/owner-dashboard')

    } catch (error) {
      console.error('Failed to save shop:', error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] ?? null);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-900 flex flex-col items-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900" />
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative z-10 flex w-full max-w-md items-center justify-center flex-col bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/30 p-6">
        <div className="mb-2 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-3 text-white shadow-lg shadow-rose-500/20">
          <FaUtensils size={28} />
        </div>
        <h1 className="p-2 text-xl font-bold text-slate-100">{ownerShop ? 'Edit Shop' : 'Create Shop'}</h1>

        <form className="space-y-3" onSubmit={shopCreateHandle}>
          <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Shop Name"
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">Shop image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-300 transition file:mr-3 file:rounded-lg file:border-0 file:bg-rose-500/15 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-rose-300 hover:file:bg-rose-500/25 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Shop Address"
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <button
            type="submit"
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 p-2.5 font-bold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-600 hover:to-orange-600 cursor-pointer"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

