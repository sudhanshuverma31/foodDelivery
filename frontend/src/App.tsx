import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import DeliveryBoyDashboard from './pages/DeliveryBoyDashboard';
import EditShop from './pages/CreateAndEditShop';
import AddItem from './pages/AddItem';
import HomePage from './pages/HomePage';
import CheckOut from './pages/CheckOut';
import { clearUser, setUser as setReduxUser } from './redux/authSlice/auth';
import { clearShopData, setOwnerShopData } from './redux/shopSlice/ownerShopSlice';
import { setShopItems } from './redux/itemSlice/itemSlice';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'owner' | 'deliveryboy';
  payload?: { role?: 'user' | 'owner' | 'deliveryboy' };
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const sessionUser = await response.json();
          setUser(sessionUser);
          dispatch(setReduxUser(sessionUser));
        }
      } catch {
        console.log('Session unavailable or network offline.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      dispatch(clearUser());
      dispatch(clearShopData());
      dispatch(setShopItems([]));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const role = user?.payload?.role ?? user?.role;

  useEffect(() => {
    if (role !== 'owner') {
      dispatch(clearShopData());
      dispatch(setShopItems([]));
      return;
    }

    const fetchOwnerShops = async () => {
      try {
        const [shopsResponse, itemsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/shops/get-shop', { credentials: 'include' }),
          fetch('http://localhost:5000/api/items/my-items', { credentials: 'include' }),
        ]);

        if (shopsResponse.status === 404) {
          dispatch(clearShopData());
        } else if (!shopsResponse.ok) {
          throw new Error('Unable to fetch owner shops.');
        } else {
          dispatch(setOwnerShopData(await shopsResponse.json()));
        }

        if (itemsResponse.status === 404) {
          dispatch(setShopItems([]));
        } else if (!itemsResponse.ok) {
          throw new Error('Unable to fetch owner items.');
        } else {
          dispatch(setShopItems(await itemsResponse.json()));
        }
      } catch (error) {
        console.error('Failed to fetch owner shops:', error);
        dispatch(clearShopData());
        dispatch(setShopItems([]));
      }
    };

    fetchOwnerShops();
  }, [dispatch, role]);

  const rootPage = role === 'owner'
    ? <OwnerDashboard user={user} onSignOut={handleSignOut} />
    : role === 'deliveryboy'
      ? <DeliveryBoyDashboard user={user} onSignOut={handleSignOut} />
      : <HomePage user={user} onSignOut={handleSignOut} />;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center gap-3">
        <span className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Loading GourmetDash...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={rootPage} />
        <Route path="/user-home-page" element={<HomePage user={user} onSignOut={handleSignOut} />} />
        <Route path="/signup" element={<SignUp onSuccess={setUser} />} />
        <Route path="/signin" element={<SignIn onSuccess={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard onSignOut={handleSignOut} />} />
        <Route path="/owner-dashboard/edit-shop" element={<EditShop />} />
        <Route path="/user-dashboard" element={<UserDashboard user={user} onSignOut={handleSignOut} />} />
        <Route path="/owner-dashboard/add-item" element={<AddItem />} />
        <Route path="/checkout" element={<CheckOut />} />
      </Routes>
    </BrowserRouter>
  );
}
