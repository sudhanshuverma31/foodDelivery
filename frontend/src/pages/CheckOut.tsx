import { useState } from 'react';
import { ArrowLeft, CheckCircle2, LoaderCircle, MapPin, ShoppingBag, Banknote, CreditCard, QrCode } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCartItems } from '../redux/cartItemSlice/cartItemSlice';

interface User {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
}

interface CheckOutProps {
  user: User | null;
  onSignOut: () => void | Promise<void>;
}

interface CartItem {
  dish: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export default function CheckOut({ user }: CheckOutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cartItem.cartItems) as CartItem[];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Credit Card'>('Cash');

  const ELIGIBLE_PINCODES = ['400001', '400002', '110001', '110002', '560001', '560002', '700001', '700002'];

  const subtotal = cart.reduce((sum, item) => sum + Number(item.dish.price) * item.quantity, 0);
  const deliveryFee = cart.length ? 3.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const placeOrder = async () => {
    setError('');
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!cart.length) return;

    if (!address.trim()) {
      setError('Please enter a delivery address.');
      return;
    }

    const cleanPincode = pincode.trim();
    if (!cleanPincode) {
      setError('Please enter a pincode.');
      return;
    }

    if (!ELIGIBLE_PINCODES.includes(cleanPincode)) {
      setError(`Delivery is not available for pincode ${cleanPincode}. Serviceable pincodes: ${ELIGIBLE_PINCODES.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map(({ dish, quantity }) => ({ dishId: dish.id, quantity })),
          subtotal,
          deliveryFee,
          tax,
          total,
          address,
          pincode: cleanPincode,
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to place your order.');

      dispatch(clearCartItems());
      setIsComplete(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to place your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-6">
        <section className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-slate-900 p-8 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
          <h1 className="mt-5 text-2xl font-black">Order placed!</h1>
          <p className="mt-2 text-sm text-slate-400">Your order has been sent to the restaurant.</p>
          <button onClick={() => navigate('/user-dashboard')} className="mt-7 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-400">
            View my orders
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => navigate('/user-home-page')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </button>
        <h1 className="mt-6 text-3xl font-black">Checkout</h1>
        <p className="mt-1 text-sm text-slate-400">Review your order and place it securely.</p>

        {!user ? (
          <section className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
            Please sign in before placing an order. <button onClick={() => navigate('/signin')} className="font-bold underline">Sign in</button>
          </section>
        ) : !cart.length ? (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-500" />
            <h2 className="mt-4 font-bold">Your cart is empty</h2>
            <button onClick={() => navigate('/user-home-page')} className="mt-5 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold hover:bg-rose-400">Browse dishes</button>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-500" /> Delivery Details
                </h2>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 123 Gourmet St, Apt 4B"
                      className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Pincode / ZIP Code</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 400001"
                      className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-rose-500 focus:outline-none"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Serviceable pincodes: 110001, 110002, 400001, 400002, 560001, 560002, 700001, 700002
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-rose-500" /> Payment Method
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border p-4 transition-all cursor-pointer ${
                      paymentMethod === 'Cash'
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <Banknote className="h-6 w-6" />
                    <span className="text-xs font-bold">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border p-4 transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <QrCode className="h-6 w-6" />
                    <span className="text-xs font-bold">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Credit Card')}
                    className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border p-4 transition-all cursor-pointer ${
                      paymentMethod === 'Credit Card'
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="text-xs font-bold">Credit Card</span>
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                <h2 className="text-lg font-bold">Order items</h2>
                <div className="mt-5 space-y-4">
                  {cart.map(({ dish, quantity }) => (
                    <div key={dish.id} className="flex items-center gap-4 border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                      {dish.image ? <img src={dish.image} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <div className="h-14 w-14 rounded-xl bg-slate-800" />}
                      <div className="min-w-0 flex-1"><p className="truncate font-semibold">{dish.name}</p><p className="text-sm text-slate-400">Qty {quantity}</p></div>
                      <p className="font-bold">${(Number(dish.price) * quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-400" /><h2 className="font-bold">Order summary</h2></div>
              <div className="mt-5 space-y-3 text-sm text-slate-400">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-slate-800 pt-3 text-base font-black text-white"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              {error && <p role="alert" className="mt-5 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
              <button onClick={placeOrder} disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Placing order...</> : `Place order • $${total.toFixed(2)}`}
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
