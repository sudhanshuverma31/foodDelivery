import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { FaUtensils } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setShopItem, updateShopItem } from '../redux/itemSlice/itemSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddItem() {
  const location = useLocation();
  const editItemData = location.state?.item;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [foodType, setFoodType] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, seIstLoading] = useState(false)

  useEffect(() => {
    if (editItemData) {
      setName(editItemData.name || '');
      setCategory(editItemData.category || '');
      setFoodType(editItemData.foodType || '');
      setPrice(editItemData.price?.toString() || '');
    }
  }, [editItemData]);


  const shopCreateHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('foodType', foodType);

    if (image) {
      formData.append('image', image);
    }

    try {
      if (editItemData) {
        const response = await axios.put(
          `http://localhost:5000/api/items/${editItemData._id || editItemData.id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        dispatch(updateShopItem(response.data));
      } else {
        seIstLoading(true)
        const response = await axios.post(
          'http://localhost:5000/api/items/add-item',
          formData,
          {
            withCredentials: true,
          }
        );
        dispatch(setShopItem(response.data));
        seIstLoading(false);
      }
      navigate('/owner-dashboard')
    } catch (error) {
      console.error('Failed to save item:', error);
      seIstLoading(false);
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
        <button
          type="button"
          onClick={() => navigate('/owner-dashboard')}
          className="self-start mb-4 text-sm font-semibold text-slate-400 transition hover:text-white cursor-pointer"
        >
          ← Back to dashboard
        </button>
        <div className="mb-2 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-3 text-white shadow-lg shadow-rose-500/20">
          <FaUtensils size={28} />
        </div>
        <h1 className="p-2 text-xl font-bold text-slate-100">{editItemData ? 'Edit Food' : 'Add Food'}</h1>

        <form className="space-y-3" onSubmit={shopCreateHandle}>
          <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">Food image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-300 transition file:mr-3 file:rounded-lg file:border-0 file:bg-rose-500/15 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-rose-300 hover:file:bg-rose-500/25 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          />

          <label className="block text-sm font-medium text-slate-300 mb-1">Select Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="">Select Category</option>
            <option value="Starters">Starters</option>
            <option value="Main Course">Main Course</option>
            <option value="Snacks">Snacks</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Beverages">Beverages</option>
            <option value="Desserts">Desserts</option>
            <option value="Salads">Salads</option>
            <option value="Street Food">Street Food</option>
          </select>

          <label className="block text-sm font-medium text-slate-300 mb-1">Select Food Type</label>
          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            className="w-full bg-slate-900/70 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-100 transition focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="">Select food type</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
          <button
            type="submit"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 p-2.5 font-bold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (<><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>loading...</span>
            </>) :
              (
                <span>Save</span>
              )}</button>
        </form>
      </div>
    </div>
  );
}

