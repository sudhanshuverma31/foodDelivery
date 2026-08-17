import { Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addToCart } from '../redux/cartItemSlice/cartItemSlice';

interface CartDish {
  id: string;
  name: string;
}

interface AddToCartProps {
  dish: CartDish;
  onAdded?: (dishName: string) => void;
  onOpenCart?: () => void;
  variant?: 'card' | 'icon' | 'menu';
}

export default function AddToCart({ dish, onAdded, onOpenCart, variant = 'icon' }: AddToCartProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth?.user);
  const [isSaving, setIsSaving] = useState(false);
  const isInCart = useSelector((state: any) =>
    state.cartItem.cartItems.some((item: { dish: CartDish }) => item.dish.id === dish.id),
  );

  const handleClick = async () => {
    if (isSaving) return;
    if (isInCart) {
      onOpenCart?.();
      return;
    }

    if (!user) {
      onAdded?.('Please sign in to add items to your cart');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('http://localhost:5000/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: dish.id,
          name: dish.name,
          price: (dish as any).price,
          image: (dish as any).image,
          quantity: 1
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to add this item to your cart.');

      dispatch(addToCart(dish));
      onAdded?.(dish.name);
    } catch (error) {
      onAdded?.((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (variant === 'card') {
    return (
      <button onClick={handleClick} disabled={isSaving} className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/15 active:scale-95 disabled:opacity-60 cursor-pointer">
        {isSaving ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...</>
        ) : isInCart ? (
          <><ShoppingCart className="w-3.5 h-3.5" /> Go to cart</>
        ) : (
          <><Plus className="w-3.5 h-3.5" /> Add to cart</>
        )}
      </button>
    );
  }

  const iconSize = variant === 'menu' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const classes = variant === 'menu'
    ? 'bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-xl transition-colors shadow-md shadow-rose-500/10 cursor-pointer active:scale-95 flex items-center justify-center'
    : 'bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center';

  return (
    <button onClick={handleClick} disabled={isSaving} className={`${classes} disabled:opacity-60`} title={isSaving ? 'Adding...' : isInCart ? 'Go to cart' : 'Add to cart'}>
      {isSaving ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : isInCart ? (
        <ShoppingCart className={iconSize} />
      ) : (
        <Plus className={iconSize} />
      )}
    </button>
  );
}
