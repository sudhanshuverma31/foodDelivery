import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetCity from "../hooks/useGetCity";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  MapPin, 
  TrendingUp,
  Calendar,
  DollarSign,
  LogOut,
  User as UserIcon,
  Utensils
} from "lucide-react";

interface DashboardProps {
  user?: { name?: string; email?: string; role?: string; mobile?: string } | null;
  onSignOut?: () => void | Promise<void>;
}

interface OrderItem {
  dishId: string;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  createdAt: string;
}

interface Dish {
  id: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export default function UserDashboard({ user, onSignOut }: DashboardProps) {
  const navigate = useNavigate();
  useGetCity();
  const locationCity = useSelector((state: any) => state.location?.city ?? 'Locating...');
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dishes to map names/images
        const dishesRes = await fetch("http://localhost:5000/api/dishes");
        if (dishesRes.ok) {
          const dishesData = await dishesRes.json();
          setDishes(dishesData);
        }

        // Fetch user orders
        const ordersRes = await fetch("http://localhost:5000/api/orders", {
          credentials: "include"
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        } else {
          setError("Failed to fetch order history.");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Error connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map dish details
  const getDishDetails = (dishId: string) => {
    return dishes.find(d => d.id === dishId || d._id === dishId);
  };

  // Calculations
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrdersCount = orders.length;
  // Calculate loyalty points: e.g. 10 points per dollar spent
  const loyaltyPoints = Math.round(totalSpent * 10);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/90 px-4 py-3.5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button onClick={() => navigate('/user-home-page')} className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 shadow-lg shadow-rose-500/25">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-transparent bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text">GourmetDash</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-[10px] text-slate-405 sm:flex">
              <MapPin className="h-3 w-3 text-rose-500" />
              <span>{locationCity}</span>
            </div>
            <button onClick={() => navigate('/user-home-page')} className="hidden rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white sm:block">Browse food</button>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-800/60 px-2.5 py-1.5 sm:px-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20"><UserIcon className="h-3.5 w-3.5 text-rose-400" /></div>
              <span className="hidden text-[11px] font-bold text-slate-200 sm:block">{user?.name || 'Guest'}</span>
            </div>
            <button onClick={onSignOut} className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400" title="Log out"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Profile & Stats Overview */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          {/* User Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-black text-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-100 text-lg leading-tight">{user?.name || 'Guest'}</h3>
                <span className="inline-block text-[9px] bg-rose-500/20 text-rose-455 px-2 py-0.5 rounded-md font-bold uppercase mt-1">
                  {user?.role || 'Customer'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800/60 space-y-3.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-200">{user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-200">{user?.mobile || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            {onSignOut && (
              <button 
                onClick={onSignOut}
                className="w-full mt-6 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-300 rounded-2xl py-2.5 font-bold text-xs transition-all cursor-pointer active:scale-98"
              >
                Sign Out Account
              </button>
            )}
          </div>

          {/* Loyalty & Rewards Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/85 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400">Rewards Program</p>
                <h4 className="text-2xl font-black text-white mt-1">{loyaltyPoints} <span className="text-xs font-normal text-slate-400">pts</span></h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full" 
                  style={{ width: `${Math.min((loyaltyPoints / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                <span>Tier Progress</span>
                <span>{loyaltyPoints} / 1000 pts</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-405 mt-4 leading-relaxed">
              Earn 10 points for every dollar spent. Redeem points for discount vouchers & free delivery!
            </p>
          </div>
        </aside>

        {/* Right Side: Order History & Live Stats */}
        <main className="flex-1 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Orders</p>
                <p className="text-lg font-black text-slate-100">{loading ? '...' : activeOrdersCount}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-450 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Spent</p>
                <p className="text-lg font-black text-slate-100">{loading ? '...' : `$${totalSpent.toFixed(2)}`}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center gap-4 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Saved Addresses</p>
                <p className="text-lg font-black text-slate-100 font-mono">3</p>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Order History</span>
              {!loading && (
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-normal">
                  {orders.length} orders
                </span>
              )}
            </h2>

            {loading ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center flex flex-col justify-center items-center gap-3">
                <span className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-slate-450 text-xs font-semibold animate-pulse">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl p-8 text-center text-sm font-semibold animate-in fade-in">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center animate-in fade-in duration-300">
                <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-350">No orders placed yet</h3>
                <p className="text-slate-500 text-xs mt-1">Explore GourmetDash menu and place your first delicious order!</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                {orders.map(order => (
                  <div key={order._id} className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/60 rounded-3xl overflow-hidden transition-all duration-300">
                    
                    {/* Order Header info */}
                    <div className="p-5 sm:p-6 bg-slate-900/50 border-b border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Order</span>
                          <span className="text-xs font-mono font-bold text-slate-300">#{order._id.substring(order._id.length - 8)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {(order as any).address && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span className="font-medium">Deliver to: {(order as any).address} ({(order as any).pincode})</span>
                          </div>
                        )}
                        {(order as any).paymentMethod && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                            <span className="font-medium bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">Method: {(order as any).paymentMethod}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total</span>
                          <span className="text-base font-extrabold text-white">${order.total.toFixed(2)}</span>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          Delivered
                        </span>
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {order.items.map((item, idx) => {
                        const dish = getDishDetails(item.dishId);
                        return (
                          <div key={idx} className="flex gap-4 items-center justify-between">
                            <div className="flex gap-3 items-center">
                              {dish?.image ? (
                                <img 
                                  src={dish.image} 
                                  alt={dish.name || "Food Item"} 
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-800"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-650">
                                  <ShoppingBag className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-xs text-slate-200">{dish?.name || `Item (${item.dishId.substring(item.dishId.length - 6)})`}</h4>
                                <p className="text-[10px] text-slate-500 capitalize mt-0.5">{dish?.category || "Food"}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-semibold text-slate-400">Qty: {item.quantity}</span>
                              <p className="text-xs font-black text-slate-200 mt-0.5">
                                ${dish ? (dish.price * item.quantity).toFixed(2) : (order.subtotal / order.items.length * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
