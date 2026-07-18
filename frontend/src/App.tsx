import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
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
  User as UserIcon
} from 'lucide-react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './components/UserDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import DeliveryBoyDashboard from './components/DeliveryBoyDashboard';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from './redux/authSlice/auth';
import EditShop from './components/CreateAndEditShop';
//import { useNavigate } from 'react-router-dom';
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

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'owner' | 'deliveryboy';
}

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
  {
    id: '3',
    name: 'Fig & Prosciutto Pizza',
    price: 19.99,
    category: 'Pizza',
    description: 'Neapolitan style crust, sweet mission figs, prosciutto di Parma, wild arugula, balsamic glaze.',
    rating: 4.7,
    time: '15-25 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '4',
    name: 'Matcha Lava Cake',
    price: 9.50,
    category: 'Desserts',
    description: 'Warm matcha green tea cake with a molten white chocolate core, served with black sesame ice cream.',
    rating: 4.9,
    time: '10-15 min',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '5',
    name: 'Avocado Quinoa Power Bowl',
    price: 14.25,
    category: 'Salads',
    description: 'Tri-color quinoa, organic Haas avocado, roasted chickpeas, heirloom tomatoes, lemon tahini dressing.',
    rating: 4.6,
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '6',
    name: 'Triple Berry Waffles',
    price: 12.00,
    category: 'Desserts',
    description: 'Belgian waffles stacked high with fresh strawberries, blueberries, raspberries, and organic maple syrup.',
    rating: 4.7,
    time: '15-25 min',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80'
  }
];

function StoreContent({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<Dish[]>(FALLBACK_DISHES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; type: string }>({ connected: false, type: 'Loading...' });
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  
 // const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await fetch('http://localhost:5000/api/status');
        const statusData = await statusRes.json();
        setDbStatus({ connected: statusData.connected, type: statusData.dbType });

        const dishesRes = await fetch('http://localhost:5000/api/dishes');
        const dishesData = await dishesRes.json();
        if (dishesData && dishesData.length > 0) {
          setDishes(dishesData);
        }
      } catch (err) {
        setDbStatus({ connected: false, type: 'Offline (Client Mock)' });
      }
    };
    fetchData();
  }, []);

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dish.id === dishId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => prev.filter(item => item.dish.id !== dishId));
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const getDeliveryFee = () => cart.length > 0 ? 3.99 : 0;
  const getTax = () => getSubtotal() * 0.08;
  const getTotal = () => getSubtotal() + getDeliveryFee() + getTax();

  const handleCheckout = async () => {
    setAuthError('');
    if (cart.length === 0) return;

    // Route Guard: Prompt user to Sign In if they are anonymous
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
        credentials: 'include', // Important to pass HttpOnly Cookie token
        body: JSON.stringify({
          items: cart.map(i => ({ dishId: i.dish.id, quantity: i.quantity })),
          subtotal: getSubtotal(),
          deliveryFee: getDeliveryFee(),
          tax: getTax(),
          total: getTotal()
        })
      });
      
      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to place order.');
      }

      console.log('Order created successfully:', resData);
      setCheckoutSuccess(true);
      setCart([]);
      setTimeout(() => setCheckoutSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setAuthError((err as Error).message);
    } finally {
      setIsCheckoutLoading(false);
    }

    
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Utensils className="text-white w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              GourmetDash
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>API Status: </span>
              <span className={`font-semibold ${dbStatus.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                {dbStatus.type}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 w-80 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
          <Search className="text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search for delicious meals..." 
            className="bg-transparent border-none outline-none text-xs w-full text-slate-200 placeholder:text-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Auth profile states */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full text-[10px] text-slate-300 border border-slate-700">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>Silicon Valley, CA</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-850 px-3 py-1.5 rounded-2xl border border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-200 leading-tight">{user.name}</p>
                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase leading-none ${
                    user.role === 'owner' 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : user.role === 'deliveryboy' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={onSignOut}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-650 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin" 
                className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 text-slate-350 hover:bg-slate-850 hover:text-slate-100 transition-all cursor-pointer"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/10 transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 lg:px-6 py-6 gap-6">
        
        {/* Left Store Side */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-600 via-orange-600 to-amber-500 p-8 md:p-10 shadow-2xl flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-black/10 rounded-full blur-2xl -mb-20"></div>
            
            <div className="relative z-10 max-w-lg space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white tracking-wide uppercase">
                <Sparkles className="w-3 h-3" /> Gourmet Experience
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Crafted Dishes Delivered Straight to Your Door
              </h1>
              <p className="text-rose-100 text-xs md:text-sm font-light">
                Discover local culinary wonders curated by culinary masters. Fastest delivery guaranteed.
              </p>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedCategory === category 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-slate-800 text-slate-350 border border-slate-700/80 hover:bg-slate-700/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
              <span>Fresh Menu Items</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-normal">
                {filteredDishes.length} items
              </span>
            </h2>
            
            {filteredDishes.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-350">No dishes found</h3>
                <p className="text-slate-550 text-xs mt-1">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDishes.map(dish => (
                  <div 
                    key={dish.id} 
                    className="bg-slate-800/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-650 hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Dish Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-700">
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-rose-450 flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-rose-500 text-rose-500" />
                        {dish.rating}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-300 flex items-center gap-1 shadow-md">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {dish.time}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-rose-400">
                          {dish.category}
                        </span>
                        <h3 className="font-bold text-base text-slate-100 group-hover:text-rose-400 transition-colors">
                          {dish.name}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                          {dish.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-extrabold text-white">${dish.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(dish)}
                          className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-xl transition-colors shadow-md shadow-rose-500/10 active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar Cart */}
        <aside className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl sticky top-24 flex flex-col max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold border-b border-slate-700 pb-4 mb-4 flex items-center gap-2 text-slate-100">
              <ShoppingBag className="text-rose-500 w-5 h-5" />
              <span>Checkout Order</span>
              {cart.length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </h2>

            {/* Error alerts */}
            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-semibold mb-4 text-center animate-in fade-in slide-in-from-top-1">
                {authError}
              </div>
            )}

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto space-y-4 divide-y divide-slate-700/40 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center">
                  {checkoutSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl space-y-2 max-w-xs animate-in fade-in zoom-in-95">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                        <Check className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm">Order Confirmed!</h3>
                      <p className="text-[10px] text-emerald-500/80">Thank you for dining with GourmetDash. Your courier is packing your order.</p>
                    </div>
                  ) : (
                    <>
                      <ShoppingBag className="w-8 h-8 text-slate-750 mb-2" />
                      <p className="text-xs font-medium">Your basket is empty</p>
                      <p className="text-[10px] text-slate-600 mt-1">Select items to populate your order</p>
                    </>
                  )}
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.dish.id} className="pt-4 flex gap-3 group">
                    <img 
                      src={item.dish.image} 
                      alt={item.dish.name} 
                      className="w-10 h-10 rounded-xl object-cover bg-slate-700"
                    />
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{item.dish.name}</h4>
                      <p className="text-[11px] font-bold text-slate-455">${(item.dish.price * item.quantity).toFixed(2)}</p>
                      
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <button 
                          onClick={() => updateQuantity(item.dish.id, -1)}
                          className="w-4.5 h-4.5 bg-slate-700 rounded-md flex items-center justify-center text-slate-350 hover:bg-slate-650 transition-colors"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs text-slate-200 font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.dish.id, 1)}
                          className="w-4.5 h-4.5 bg-slate-700 rounded-md flex items-center justify-center text-slate-350 hover:bg-slate-650 transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.dish.id)}
                      className="text-slate-600 hover:text-rose-450 p-1 rounded transition-colors self-start opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Calculations and CTA */}
            {cart.length > 0 && (
              <div className="border-t border-slate-700 pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Delivery fee</span>
                  <span>${getDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tax (8%)</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-200 border-t border-slate-700/50 pt-3">
                  <span>Total</span>
                  <span className="text-rose-400 text-sm">${getTotal().toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-2xl py-3 font-bold transition-all shadow-lg shadow-rose-500/10 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckoutLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="flex justify-center items-center gap-2 mb-2 text-slate-400">
          <Utensils className="w-4 h-4 text-rose-500" />
          <span className="font-bold">GourmetDash MERN Workspace</span>
        </div>
        <p>&copy; 2026 GourmetDash Inc. Secured with server-side cookie authentication.</p>
      </footer>
    </div>
  );
}

function RoleBasedHome({ user, onSignOut }: { user: User | null; onSignOut: () => void }) {
  const reduxUser = useSelector((state: any) => state.auth?.user);
  const activeUser = reduxUser || user;

  if (!activeUser) {
    return <StoreContent user={null} onSignOut={onSignOut} />;
  }

  const role = activeUser.payload?.role ?? activeUser.role;
  console.log('Active User Role in App:', role);

  if (role === 'owner') {
    return <OwnerDashboard user={activeUser} onSignOut={onSignOut} />;
  }

  if (role === 'deliveryboy') {
    return <DeliveryBoyDashboard user={activeUser} onSignOut={onSignOut} />;
  }

  return <UserDashboard user={activeUser} onSignOut={onSignOut} />;

//   switch (role) {
//     case 'owner':
//      return <OwnerDashboard user={activeUser} onSignOut={onSignOut} />;
//     case 'deliveryboy':
//       return <DeliveryBoyDashboard user={activeUser} onSignOut={onSignOut} />;
//     default:
//       return <UserDashboard user={activeUser} onSignOut={onSignOut} />;
//   }
 }

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Resume user profile session on page mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include' // Required for sending HttpOnly Cookie
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
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
        credentials: 'include'
      });
      setUser(null);
      dispatch(clearUser());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center gap-3">
        <span className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
        <p className="text-slate-400 text-xs font-semibold tracking-wide animate-pulse">Loading GourmetDash...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<RoleBasedHome user={user} onSignOut={handleSignOut} />} 
        />
        <Route 
          path="/signup" 
          element={<SignUp onSuccess={(u) => setUser(u)} />} 
        />
        <Route 
          path="/signin" 
          element={<SignIn onSuccess={(u) => setUser(u)} />} 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        <Route
          path="/owner-dashboard/edit-shop"
          element={<EditShop/>}
        />
        <Route 
          path='/owner-dashboard'
          element={<OwnerDashboard onSignOut={handleSignOut} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
