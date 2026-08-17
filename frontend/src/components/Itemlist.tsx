import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Sparkles, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deleteShopItem } from '../redux/itemSlice/itemSlice';

function Itemlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state: any) => state.shopItem.items) || [];

  const [deleteState, setDeleteState] = useState<{
    show: boolean;
    itemId: string | null;
    itemName: string | null;
    isDeleting: boolean;
    error: string | null;
  }>({
    show: false,
    itemId: null,
    itemName: null,
    isDeleting: false,
    error: null
  });

  const handleDeleteClick = (itemId: string, itemName: string) => {
    setDeleteState({
      show: true,
      itemId,
      itemName,
      isDeleting: false,
      error: null
    });
  };

  const confirmDelete = async () => {
    if (!deleteState.itemId) return;
    setDeleteState(prev => ({ ...prev, isDeleting: true, error: null }));
    try {
      const response = await fetch(`http://localhost:5000/api/items/${deleteState.itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        dispatch(deleteShopItem(deleteState.itemId));
        setDeleteState({ show: false, itemId: null, itemName: null, isDeleting: false, error: null });
      } else {
        const errorData = await response.json();
        setDeleteState(prev => ({ 
          ...prev, 
          isDeleting: false, 
          error: errorData.message || 'Failed to delete item' 
        }));
      }
    } catch (err) {
      console.error('Delete item error:', err);
      setDeleteState(prev => ({ 
        ...prev, 
        isDeleting: false, 
        error: 'Error connecting to server' 
      }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md border border-orange-100 p-8 text-center mt-6">
        <Sparkles className="text-gray-300 w-12 h-12 mx-auto mb-3 text-[#ff4d2d]" />
        <h3 className="text-lg font-bold text-gray-750">No Food Items Added Yet</h3>
        <p className="text-gray-500 text-sm mt-1">Your menu is currently empty. Start adding delicious items to your shop!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl px-4 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>Menu Items</span>
        <span className="text-xs bg-[#ff4d2d]/10 text-[#ff4d2d] px-2 py-0.5 rounded-full font-semibold">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {items.map((item: any) => {
          const isVeg = item.foodType?.toLowerCase().includes('veg') && !item.foodType?.toLowerCase().includes('non');
          return (
            <div 
              key={item._id || item.id} 
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Item Image */}
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                
                {/* Veg/Non-Veg Badge */}
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-md flex items-center gap-1 ${
                  isVeg 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {item.foodType || 'Veg'}
                </span>
              </div>

              {/* Item Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span className="capitalize">{item.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-[#ff4d2d] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <span className="text-lg font-black text-gray-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/owner-dashboard/add-item', { state: { item } })}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#ff4d2d] transition-colors bg-gray-50 hover:bg-[#ff4d2d]/10 px-2.5 py-1.5 rounded-lg border border-gray-100 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item._id || item.id, item.name)}
                      className="flex items-center gap-1 text-xs font-semibold text-red-650 hover:text-red-500 transition-colors bg-red-50 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-100 cursor-pointer animate-all duration-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Confirm Delete Modal */}
      {deleteState.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => !deleteState.isDeleting && setDeleteState({ show: false, itemId: null, itemName: null, isDeleting: false, error: null })}
          />
          
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-orange-50/50 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-[#ff4d2d]">
              <Trash2 className="w-5 h-5 animate-pulse" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-800">Delete Menu Item?</h3>
            <p className="text-gray-500 text-sm mt-2 px-2">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{deleteState.itemName}"</span>? This action is permanent.
            </p>
            
            {deleteState.error && (
              <div className="mt-3 w-full bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-medium">
                {deleteState.error}
              </div>
            )}
            
            <div className="flex gap-3 w-full mt-6">
              <button
                type="button"
                disabled={deleteState.isDeleting}
                onClick={() => setDeleteState({ show: false, itemId: null, itemName: null, isDeleting: false, error: null })}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-xs transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteState.isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-[#ff4d2d] hover:bg-[#ff4d2d]/90 text-white font-semibold text-xs transition-all duration-200 shadow-md shadow-red-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {deleteState.isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Itemlist;
