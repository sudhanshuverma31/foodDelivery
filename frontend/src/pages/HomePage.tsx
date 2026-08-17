import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  MapPin,
  Star,
  Clock,
  Plus,
  Minus,
  Trash2,
  Check,
  Sparkles,
  Utensils,
  Database,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Heart,
  X,
  ShoppingCart,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateQuantity as reduxUpdateQuantity,
  removeFromCart as reduxRemoveFromCart,
  clearCartItems as reduxClearCartItems
  ,setCartItems as reduxSetCartItems
} from '../redux/cartItemSlice/cartItemSlice';
import AddToCart from '../components/AddToCart';
import ThemeToggle from '../components/ThemeToggle';
import useGetCity from '../hooks/useGetCity';
// ─── Types ───────────────────────────────────────────────────────────────────


interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  time: string;
  image: string;
}

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface ToastNotification {
  id: string;
  message: string;
  isDismissing?: boolean;
}

interface HomePageProps {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    mobile?: string;
    role?: string;
    payload?: any
  } | null;
  onSignOut?: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Sushi', 'Desserts', 'Salads'];

const FALLBACK_DISHES: Dish[] = [
  {
    id: '1',
    name: 'Truffle Glazed Burger',
    price: 16.99,
    category: 'Burgers',
    description: 'Aged wagyu beef patty, black truffle aioli, melted gruyère cheese on a toasted brioche bun.',
    rating: 4.9,
    time: '20-30 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    name: 'Spicy Salmon Crunch Roll',
    price: 18.50,
    category: 'Sushi',
    description: 'Fresh Atlantic salmon, avocado, cucumber, spicy mayo, topped with crispy tempura flakes.',
    rating: 4.8,
    time: '25-35 min',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
  },
  // {
  //   id: '3',
  //   name: 'Fig & Prosciutto Pizza',
  //   price: 19.99,
  //   category: 'Pizza',
  //   description: 'Neapolitan style crust, sweet mission figs, prosciutto di Parma, wild arugula, balsamic glaze.',
  //   rating: 4.7,
  //   time: '15-25 min',
  //   image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '4',
  //   name: 'Matcha Lava Cake',
  //   price: 9.50,
  //   category: 'Desserts',
  //   description: 'Warm matcha green tea cake with a molten white chocolate core, served with black sesame ice cream.',
  //   rating: 4.9,
  //   time: '10-15 min',
  //   image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '5',
  //   name: 'Avocado Quinoa Power Bowl',
  //   price: 14.25,
  //   category: 'Salads',
  //   description: 'Tri-color quinoa, organic Haas avocado, roasted chickpeas, heirloom tomatoes, lemon tahini dressing.',
  //   rating: 4.6,
  //   time: '15-20 min',
  //   image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '6',
  //   name: 'Triple Berry Waffles',
  //   price: 12.00,
  //   category: 'Desserts',
  //   description: 'Belgian waffles stacked high with fresh strawberries, blueberries, raspberries, and organic maple syrup.',
  //   rating: 4.7,
  //   time: '15-25 min',
  //   image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '7',
  //   name: 'Truffle Glazed Burger',
  //   price: 16.99,
  //   category: 'Burgers',
  //   description: 'Aged wagyu beef patty, black truffle aioli, melted gruyère cheese on a toasted brioche bun.',
  //   rating: 4.9,
  //   time: '20-30 min',
  //   image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '8',
  //   name: 'Spicy Salmon Crunch Roll',
  //   price: 18.50,
  //   category: 'Sushi',
  //   description: 'Fresh Atlantic salmon, avocado, cucumber, spicy mayo, topped with crispy tempura flakes.',
  //   rating: 4.8,
  //   time: '25-35 min',
  //   image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '9',
  //   name: 'Fig & Prosciutto Pizza',
  //   price: 19.99,
  //   category: 'Pizza',
  //   description: 'Neapolitan style crust, sweet mission figs, prosciutto di Parma, wild arugula, balsamic glaze.',
  //   rating: 4.7,
  //   time: '15-25 min',
  //   image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '10',
  //   name: 'Matcha Lava Cake',
  //   price: 9.50,
  //   category: 'Desserts',
  //   description: 'Warm matcha green tea cake with a molten white chocolate core, served with black sesame ice cream.',
  //   rating: 4.9,
  //   time: '10-15 min',
  //   image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'
  // },
  // {
  //   id: '11',
  //   name: 'Avocado Quinoa Power Bowl',
  //   price: 14.25,
  //   category: 'Salads',
  //   description: 'Tri-color quinoa, organic Haas avocado, roasted chickpeas, heirloom tomatoes, lemon tahini dressing.',
  //   rating: 4.6,
  //   time: '15-20 min',
  //   image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  // }
];

const STATS = [
  { icon: Utensils, value: '500+', label: 'Menu Items' },
  { icon: Award, value: '4.9★', label: 'Average Rating' },
  { icon: Clock, value: '25min', label: 'Avg. Delivery' },
  { icon: Flame, value: '50+', label: 'Restaurants' },
];
// useEffect(()=>{

//   const allOwner = fetch()

// },[])
// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage({ user, onSignOut }: HomePageProps) {
  const navigate = useNavigate();
  useGetCity();
  // Core state
  const [dishes, setDishes] = useState<Dish[]>(FALLBACK_DISHES);
  const [shops, setShops] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const cart = useSelector((state: any) => state.cartItem.cartItems);
  const detectedCity = useSelector((state: any) => state.location?.city ?? null);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; type: string }>({ connected: false, type: 'Loading...' });
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Extended feature state
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [favoriteShops, setFavoriteShops] = useState<string[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'dishes' | 'shops' | 'favorites' | 'recommended'>('dishes');
  const [selectedShopMenu, setSelectedShopMenu] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  //console.log(dishes);
  // ── Data fetching ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await fetch('http://localhost:5000/api/status');
        const statusData = await statusRes.json();
        setDbStatus({ connected: statusData.connected, type: statusData.dbType });

        const dishesRes = await fetch('http://localhost:5000/api/dishes');
        const dishesData = await dishesRes.json();
        if (dishesData && dishesData.length > 0) setDishes(dishesData);

        const shopsRes = await fetch('http://localhost:5000/api/shops/all-shops');
        if (shopsRes.ok) {
          const shopsData = await shopsRes.json();
          setShops(shopsData);

        }
      } catch {
        setDbStatus({ connected: false, type: 'Offline (Mock)' });
      }
    };
    fetchData();

    const savedFavShops = localStorage.getItem('favShops');
    const savedFavFoods = localStorage.getItem('favFoods');
    if (savedFavShops) setFavoriteShops(JSON.parse(savedFavShops));
    if (savedFavFoods) setFavoriteFoods(JSON.parse(savedFavFoods));
  }, []);

  // Restore the signed-in user's cart after a page refresh.
  useEffect(() => {
    if (!user) {
      dispatch(reduxClearCartItems());
      return;
    }

    const loadCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', { credentials: 'include' });
        if (!response.ok) return;
        const data = await response.json();
        const items = (data.items ?? []).map((item: any) => ({
          dish: {
            id: item.productId,
            name: item.name,
            price: Number(item.price),
            image: item.image ?? '',
            category: item.category ?? '',
            description: item.description ?? '',
            rating: Number(item.rating ?? 0),
            time: item.time ?? ''
          },
          quantity: item.quantity
        }));
        dispatch(reduxSetCartItems(items));
      } catch {
        // Keep the local cart if the API is temporarily unavailable.
      }
    };
    loadCart();
  }, [user?.id, dispatch]);

  // Auto-select the user's detected city once shops are loaded
  useEffect(() => {
    if (!detectedCity || shops.length === 0) return;
    const shopCities = shops.map((s: any) => s.city?.toLowerCase()).filter(Boolean);
    const match = shopCities.find((c: string) => c === detectedCity.toLowerCase());
    setSelectedCity(match ? detectedCity : 'All');
  }, [detectedCity, shops]);
  //console.log(shops)
  // ── Favorites ────────────────────────────────────────────────────────────
  const toggleFavoriteShop = (shopId: string) => {
    setFavoriteShops(prev => {
      const next = prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId];
      localStorage.setItem('favShops', JSON.stringify(next));
      return next;
    });
  };
  const toggleFavoriteFood = (foodId: string) => {
    setFavoriteFoods(prev => {
      const next = prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId];
      localStorage.setItem('favFoods', JSON.stringify(next));
      return next;
    });
  };

  // ── Derived data ─────────────────────────────────────────────────────────
  const cities = ['All', ...Array.from(new Set(shops.map((s: any) => s.city).filter(Boolean)))];

  const filteredShops = shops.filter((shop: any) => {
    const matchesCity = selectedCity === 'All' || shop.city?.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = shop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  //console.log(filteredShops.length)

  const allAvailableFoods = [
    ...dishes,
    ...shops.flatMap((s: any) => (s.items || []).map((item: any) => ({
      id: item._id || item.id,
      name: item.name,
      price: Number(item.price),
      category: item.category,
      description: `${item.foodType} item from ${s.name}.`,
      rating: 4.8,
      time: '20-30 min',
      image: item.image
    })))
  ];
  //console.log(allAvailableFoods)
  const favoriteFoodsList = allAvailableFoods.filter(f => favoriteFoods.includes(f.id));
  const favoriteShopsList = shops.filter(s => favoriteShops.includes(s._id || s.id));
  const recommendedShops = filteredShops.slice(0, 3);
  const recommendedFoods = allAvailableFoods.filter(f => f.rating >= 4.8);

  //console.log(dishes.length)
  const filteredDishes = allAvailableFoods.filter(dish => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  //console.log(filteredDishes.length)
  // ── Cart helpers ─────────────────────────────────────────────────────────
  // const addToCart = (dish: Dish) => {
  //   setCart(prev => {
  //     const existing = prev.find(item => item.dish.id === dish.id);
  //     if (existing) return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
  //     return [...prev, { dish, quantity: 1 }];
  //   });
  // };
  //console.log(addToCart)
  const updateQuantity = async (dishId: string, delta: number) => {
    const current = cart.find((item: CartItem) => item.dish.id === dishId);
    const quantity = (current?.quantity ?? 0) + delta;
    if (quantity <= 0) {
      await removeFromCart(dishId);
      return;
    }
    const response = await fetch(`http://localhost:5000/api/cart/items/${encodeURIComponent(dishId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });
    if (response.ok) dispatch(reduxUpdateQuantity({ dishId, delta }));
  };
  const removeFromCart = async (dishId: string) => {
    const response = await fetch(`http://localhost:5000/api/cart/items/${encodeURIComponent(dishId)}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok) dispatch(reduxRemoveFromCart(dishId));
  };

  const showToast = (message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message }]);

    // Set dismissing state after 2.7s
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, isDismissing: true } : t));
    }, 3700);

    // Remove from DOM after 3.0s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const getSubtotal = () => cart.reduce((sum: number, item: CartItem) => sum + item.dish.price * item.quantity, 0);
  const getDeliveryFee = () => cart.length > 0 ? 3.99 : 0;
  const getTax = () => getSubtotal() * 0.08;
  const getTotal = () => getSubtotal() + getDeliveryFee() + getTax();
  const totalQty = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  // ── Checkout ─────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    setAuthError('');
    if (cart.length === 0) return;
    if (!user) {
      setAuthError('Please sign in to place an order.');
      setTimeout(() => navigate('/signin'), 1500);
      return;
    }
    setIsCheckoutLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map((item: CartItem) => ({ dishId: item.dish.id, quantity: item.quantity })),
          subtotal: getSubtotal(),
          deliveryFee: getDeliveryFee(),
          tax: getTax(),
          total: getTotal()
        })
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to place order.');
      setCheckoutSuccess(true);
      dispatch(reduxClearCartItems());
      setTimeout(() => setCheckoutSuccess(false), 5000);
    } catch (err) {
      setAuthError((err as Error).message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen dark:bg-slate-900 bg-[#fff9f6] dark:text-slate-100 text-black font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header className="sticky top-0 z-50 dark:bg-slate-900/90 bg-[#fff9f6]/90 backdrop-blur-xl border-b dark:border-slate-800/80 border-gray-200 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Utensils className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                GourmetDash
              </span>
              {/* <div className="flex items-center gap-1 text-[9px] text-slate-500">
                <Database className="w-2.5 h-2.5 text-emerald-400" />
                <span className={dbStatus.connected ? 'text-emerald-400' : 'text-amber-400'}>{dbStatus.type}</span>
              </div> */}
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-sm items-center gap-2 dark:bg-slate-800/70 bg-white/70 border dark:border-slate-700/80 border-gray-200 rounded-full px-4 py-2 focus-within:border-rose-500/60 focus-within:ring-2 focus-within:ring-rose-500/15 transition-all">
            <Search className="dark:text-slate-500 text-gray-400 w-3.5 h-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Search meals or restaurants..."
              className="bg-transparent border-none outline-none text-xs w-full dark:text-slate-200 text-gray-800 dark:placeholder:text-slate-500 placeholder:text-gray-400"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-1.5 dark:bg-slate-800/60 bg-white/60 px-3 py-1.5 rounded-full text-[10px] dark:text-slate-400 text-gray-600 border dark:border-slate-700/60 border-gray-200">
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>{detectedCity ?? 'Locating...'}</span>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-gray-100 dark:text-slate-400 text-gray-600 border dark:border-slate-700 border-gray-200 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-rose-500 text-white text-[9px] font-black rounded-full">
                  {totalQty}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 dark:bg-slate-800/60 bg-white/60 px-3 py-1.5 rounded-2xl border dark:border-slate-800 border-gray-200">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <p onClick={() => {
                    navigate("/user-dashboard")
                  }} className="text-[11px] font-bold dark:text-slate-200 text-gray-800 leading-tight">{user.name}</p>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl dark:bg-slate-800 bg-white hover:bg-rose-500/10 dark:text-slate-400 text-gray-600 border dark:border-slate-700 border-gray-200 transition-colors cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signin" className="text-xs font-semibold px-4 py-2 rounded-xl border dark:border-slate-700 border-gray-200 dark:text-slate-300 text-gray-700 hover:dark:bg-slate-800 hover:bg-gray-100 transition-all cursor-pointer">
                  Sign In
                </Link>
                <Link to="/signup" className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 shadow-md shadow-rose-500/20 transition-all cursor-pointer">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 rounded-full text-[11px] font-semibold text-rose-400 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Premium Food Delivery Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Crafted Dishes{' '}
              <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Delivered
              </span>
              <br />to Your Door
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
              Discover local culinary wonders curated by culinary masters. From artisan burgers to gourmet sushi — fastest delivery guaranteed.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab('dishes')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-rose-500/20 hover:from-rose-600 hover:to-orange-600 transition-all cursor-pointer active:scale-95"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('shops')}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-300 px-6 py-3 rounded-2xl text-sm font-bold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
              >
                Browse Restaurants
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-72">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center backdrop-blur-md hover:border-rose-500/30 transition-all">
                <Icon className="w-5 h-5 text-rose-400 mx-auto mb-1.5" />
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-[10px] text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center border-b border-slate-800 gap-1 mt-2 overflow-x-auto scrollbar-none">
          {(
            [
              { id: 'dishes', label: 'All Menu', icon: Utensils },
              { id: 'shops', label: 'Restaurants', icon: MapPin },
              { id: 'recommended', label: 'Recommended', icon: Sparkles },
              { id: 'favorites', label: 'Favorites', icon: Heart },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${activeTab === tab.id
                ? 'text-rose-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-rose-500 after:to-orange-500 after:rounded-t-full'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'favorites' && (favoriteShops.length + favoriteFoods.length) > 0 && (
                <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                  {favoriteShops.length + favoriteFoods.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── City Filter ── */}
        {(activeTab === 'shops' || activeTab === 'recommended') && (
          <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2 w-fit mt-5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] text-slate-400 font-medium">City:</span>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-200 outline-none border-none cursor-pointer"
            >
              {cities.map(city => (
                <option key={city} value={city} className="bg-slate-900 text-slate-200">{city}</option>
              ))}
            </select>
          </div>
        )}

        {/* ══════════════ TAB: ALL MENU ══════════════ */}
        {activeTab === 'dishes' && (
          <div className="mt-6 space-y-6">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${selectedCategory === category
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/80 hover:bg-slate-700/60 hover:text-slate-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Section title */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Fresh Menu Items
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-normal">
                  {filteredDishes.length} items
                </span>
              </h2>
            </div>

            {/* Dishes grid */}
            {filteredDishes.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-16 text-center">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-400">No dishes found</h3>
                <p className="text-slate-600 text-xs mt-1">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredDishes.map(dish => {
                  const isFav = favoriteFoods.includes(dish.id);
                  return (
                    <div
                      key={dish.id}
                      className="bg-slate-800/70 border border-slate-700/40 rounded-2xl overflow-hidden hover:border-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col group relative"
                    >
                      {/* Favorite */}
                      <button
                        onClick={() => toggleFavoriteFood(dish.id)}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md bg-slate-900/70 border transition-all cursor-pointer ${isFav ? 'text-rose-500 border-rose-500/40 bg-rose-500/10' : 'text-slate-500 border-slate-700/60 hover:text-rose-400'
                          }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                      {/* Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-700">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {dish.rating}
                        </span>
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {dish.time}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <span className="text-[9px] uppercase font-black tracking-wider text-rose-400">{dish.category}</span>
                          <h3 className="font-bold text-sm text-slate-100 mt-0.5 group-hover:text-rose-300 transition-colors">{dish.name}</h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-1 line-clamp-2">{dish.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-white">${dish.price.toFixed(2)}</span>
                          <AddToCart dish={dish} variant="card" onOpenCart={() => setIsCartOpen(true)} onAdded={(name) => showToast(`${name} added to cart!`)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TAB: RESTAURANTS ══════════════ */}
        {activeTab === 'shops' && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                All Restaurants
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-normal">
                  {filteredShops.length} shops
                </span>
              </h2>
            </div>

            {filteredShops.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-16 text-center">
                <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-400">No restaurants found</h3>
                <p className="text-slate-600 text-xs mt-1">Try selecting a different city filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredShops.map((shop: any) => {
                  const isShopFav = favoriteShops.includes(shop._id || shop.id);
                  return (
                    <div
                      key={shop._id || shop.id}
                      className="bg-slate-800/70 border border-slate-700/40 rounded-2xl overflow-hidden hover:border-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col group relative"
                    >
                      <button
                        onClick={() => toggleFavoriteShop(shop._id || shop.id)}
                        className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md bg-slate-900/70 border transition-all cursor-pointer ${isShopFav ? 'text-rose-500 border-rose-500/40 bg-rose-500/10' : 'text-slate-500 border-slate-700/60 hover:text-rose-400'
                          }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isShopFav ? 'fill-current' : ''}`} />
                      </button>

                      <div className="relative h-40 overflow-hidden bg-slate-700">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-rose-400" />
                          {shop.city}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <span className="text-[9px] uppercase font-black tracking-wider text-rose-400">{shop.category}</span>
                          <h3 className="font-bold text-sm text-slate-100 mt-0.5 group-hover:text-rose-300 transition-colors">{shop.name}</h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-1 line-clamp-2">{shop.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedShopMenu(shop)}
                          className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-500/15 active:scale-98 flex items-center justify-center gap-1.5"
                        >
                          View Menu
                          <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[9px]">{shop.items?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TAB: RECOMMENDED ══════════════ */}
        {activeTab === 'recommended' && (
          <div className="mt-6 space-y-10">
            {/* Recommended Shops */}
            <section>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Recommended Restaurants
              </h2>
              {recommendedShops.length === 0 ? (
                <p className="text-xs text-slate-600">No shops found in this city.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedShops.map((shop: any) => {
                    const isShopFav = favoriteShops.includes(shop._id || shop.id);
                    const shopKey = shop._id || shop.id;
                    return (
                      <div key={shopKey} className="bg-slate-800/70 border border-slate-700/40 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-rose-500/20 transition-all group">
                        <div className="flex gap-3 items-center min-w-0">
                          <img src={shop.image} alt={shop.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-700" />
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs text-slate-200 truncate">{shop.name}</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">{shop.city} • {shop.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => toggleFavoriteShop(shop._id || shop.id)} className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isShopFav ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'text-slate-400 border-slate-700 hover:text-rose-400'}`}>
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button onClick={() => setSelectedShopMenu(shop)} className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer">
                            Menu
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recommended Foods */}
            <section>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-5">
                <Star className="w-4 h-4 text-rose-400 fill-current" />
                Highly Rated Dishes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedFoods.slice(0, 6).map(food => {
                  const isFoodFav = favoriteFoods.includes(food.id);
                  return (
                    <div key={food.id} className="bg-slate-800/70 border border-slate-700/40 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-rose-500/20 transition-all group">
                      <div className="flex gap-3 items-center min-w-0">
                        <img src={food.image} alt={food.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-700" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-xs text-slate-200 truncate">{food.name}</h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">${food.price.toFixed(2)} • {food.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span className="text-[9px] text-amber-400 font-bold">{food.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => toggleFavoriteFood(food.id)} className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isFoodFav ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'text-slate-400 border-slate-700 hover:text-rose-400'}`}>
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <AddToCart dish={food} onOpenCart={() => setIsCartOpen(true)} onAdded={(name) => showToast(`${name} added to cart!`)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ══════════════ TAB: FAVORITES ══════════════ */}
        {activeTab === 'favorites' && (
          <div className="mt-6 space-y-10">
            <section>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-5">
                <Heart className="w-4 h-4 text-rose-500 fill-current" />
                Favorite Restaurants
              </h2>
              {favoriteShopsList.length === 0 ? (
                <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                  <Heart className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">No favorite restaurants yet. Tap the ♥ icon on any restaurant!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteShopsList.map((shop: any) => {
                    const shopKey = shop._id || shop.id;
                    return (
                      <div key={shopKey} className="bg-slate-800/70 border border-slate-700/40 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-rose-500/20 transition-all">
                        <div className="flex gap-3 items-center min-w-0">
                          <img src={shop.image} alt={shop.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs text-slate-200 truncate">{shop.name}</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">{shop.city}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => toggleFavoriteShop(shop._id || shop.id)} className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 bg-rose-500/10 cursor-pointer">
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button onClick={() => setSelectedShopMenu(shop)} className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer">
                            Menu
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-5">
                <ShoppingBag className="w-4 h-4 text-rose-400" />
                Favorite Food Items
              </h2>
              {favoriteFoodsList.length === 0 ? (
                <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-10 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">No favorite dishes yet. Tap the ♥ icon on any dish!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteFoodsList.map(food => (
                    <div key={food.id} className="bg-slate-800/70 border border-slate-700/40 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-rose-500/20 transition-all">
                      <div className="flex gap-3 items-center min-w-0">
                        <img src={food.image} alt={food.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-xs text-slate-200 truncate">{food.name}</h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">${food.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => toggleFavoriteFood(food.id)} className="p-1.5 rounded-lg border border-rose-500/30 text-rose-500 bg-rose-500/10 cursor-pointer">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <AddToCart dish={food} onOpenCart={() => setIsCartOpen(true)} onAdded={(name) => showToast(`${name} added to cart!`)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-slate-950 border-t border-slate-800/80 px-6 py-8 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center">
              <Utensils className="text-white w-4 h-4" />
            </div>
            <span className="font-black text-slate-300 text-sm">GourmetDash</span>
          </div>
          <p className="text-slate-600 text-xs">© 2026 GourmetDash Inc. Premium Food Delivery Platform.</p>
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>MERN Stack · Secured with HttpOnly Cookies</span>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ CART DRAWER ═══════════════════ */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-rose-400 w-5 h-5" />
                <h2 className="text-base font-black text-slate-100">Your Cart</h2>
                {totalQty > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalQty}</span>
                )}
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error */}
            {authError && (
              <div className="mx-6 mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-semibold text-center">
                {authError}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-slate-600">
                  {checkoutSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                        <Check className="w-6 h-6" />
                      </div>
                      <h3 className="font-black text-sm">Order Placed!</h3>
                      <p className="text-[11px] text-emerald-500/70">Your food is being prepared. Thank you!</p>
                    </div>
                  ) : (
                    <>
                      <ShoppingBag className="w-12 h-12 text-slate-800" />
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Your cart is empty</p>
                        <p className="text-xs text-slate-700 mt-1">Add some delicious dishes to get started</p>
                      </div>
                      <button
                        onClick={() => { setIsCartOpen(false); setActiveTab('dishes'); }}
                        className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        Browse Menu <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                cart.map((item: CartItem) => (
                  <div key={item.dish.id} className="flex gap-3 group bg-slate-800/60 rounded-2xl p-3 border border-slate-700/40">
                    <img src={item.dish.image} alt={item.dish.name} className="w-14 h-14 rounded-xl object-cover bg-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-200 leading-tight line-clamp-1">{item.dish.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.dish.id)}
                          className="text-slate-600 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-rose-400 font-black mt-0.5">${(item.dish.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.dish.id, -1)}
                          className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-200 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.dish.id, 1)}
                          className="w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.dish.id)}
                          className="ml-auto text-slate-700 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary + CTA */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-slate-800 space-y-3 bg-slate-900">
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Delivery fee</span><span>${getDeliveryFee().toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax (8%)</span><span>${getTax().toFixed(2)}</span></div>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-100 border-t border-slate-800 pt-3">
                  <span>Total</span>
                  <span className="text-rose-400 text-base">${getTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-2xl py-3.5 font-black text-sm transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Checkout <ChevronRight className="w-4 h-4" />
                </button>
                {/* <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-2xl py-3.5 font-black text-sm transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckoutLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <> <span>Place Order</span> <ChevronRight className="w-4 h-4" /> </>
                  )}
                </button> */}
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══════════════════ SHOP MENU MODAL ═══════════════════ */}
      {selectedShopMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setSelectedShopMenu(null)}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="flex gap-4 items-start mb-6">
              <img
                src={selectedShopMenu.image}
                alt={selectedShopMenu.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white">{selectedShopMenu.name}</h3>
                <p className="text-slate-500 text-[10px] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {selectedShopMenu.city}, {selectedShopMenu.state}
                </p>
                <p className="text-slate-600 text-[10px] mt-1 line-clamp-2">{selectedShopMenu.description}</p>
              </div>
              <button
                onClick={() => setSelectedShopMenu(null)}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-400">
                Menu <span className="text-slate-600">({selectedShopMenu.items?.length || 0} items)</span>
              </h4>
            </div>

            {(!selectedShopMenu.items || selectedShopMenu.items.length === 0) ? (
              <div className="text-center py-12">
                <Utensils className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-xs">No menu items added yet by this restaurant.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedShopMenu.items.map((item: any) => {
                  const foodDish: Dish = {
                    id: item._id || item.id,
                    name: item.name,
                    price: Number(item.price),
                    category: item.category,
                    description: `${item.foodType} item from ${selectedShopMenu.name}.`,
                    rating: 4.8,
                    time: '20-30 min',
                    image: item.image
                  };
                  const isFoodFav = favoriteFoods.includes(foodDish.id);
                  return (
                    <div key={foodDish.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-rose-500/20 transition-all">
                      <div className="flex gap-3 items-center min-w-0">
                        <img src={foodDish.image} alt={foodDish.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-xs text-slate-200 truncate">{foodDish.name}</h5>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${item.foodType === 'Veg'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                              {item.foodType}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 capitalize">{foodDish.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-black text-white">${foodDish.price.toFixed(2)}</span>
                        <button
                          onClick={() => toggleFavoriteFood(foodDish.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isFoodFav ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'border-slate-700 text-slate-500 hover:text-rose-400'
                            }`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <AddToCart dish={foodDish} variant="menu" onOpenCart={() => setIsCartOpen(true)} onAdded={(name) => showToast(`${name} added to cart!`)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setSelectedShopMenu(null)}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════ TOAST NOTIFICATIONS ═══════════════════ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 text-slate-100 px-4 py-3 rounded-xl shadow-2xl shadow-emerald-500/10 pointer-events-auto transition-all duration-300 transform ${toast.isDismissing
              ? 'opacity-0 translate-y-2 scale-95'
              : 'opacity-100 translate-y-0 scale-100 animate-in slide-in-from-bottom-2 fade-in duration-200'
              }`}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <p className="text-xs font-semibold leading-none">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
