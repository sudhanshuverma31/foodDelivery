import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut, MapPin, Pencil, Plus, User as UserIcon, Utensils } from 'lucide-react';
import Itemlist from '../components/Itemlist';
import useGetCity from '../hooks/useGetCity';

interface DashboardProps {
  user?: { name?: string; email?: string; role?: string } | null;
  onSignOut?: () => void | Promise<void>;
}

export default function OwnerDashboard({ user, onSignOut }: DashboardProps) {
  const ownerShop = useSelector((state: any) => state.owner.ownerShopData);
  const locationCity = useSelector((state: any) => state.location?.city ?? 'Locating...');
  const navigate = useNavigate();
  useGetCity();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-900/90 px-4 py-3.5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button onClick={() => navigate('/user-home-page')} className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 shadow-lg shadow-rose-500/25"><Utensils className="h-5 w-5 text-white" /></div>
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-lg font-black tracking-tight text-transparent">GourmetDash</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-[10px] text-slate-400 sm:flex"><MapPin className="h-3 w-3 text-rose-500" /><span>{locationCity}</span></div>
            <button onClick={() => navigate(ownerShop ? '/owner-dashboard/add-item' : '/owner-dashboard/edit-shop')} className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-2 text-xs font-bold text-white transition hover:from-rose-600 hover:to-orange-600 sm:flex"><Plus className="h-3.5 w-3.5" />{ownerShop ? 'Add food' : 'Create shop'}</button>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-800/60 px-2.5 py-1.5 sm:px-3"><div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20"><UserIcon className="h-3.5 w-3.5 text-rose-400" /></div><span className="hidden text-[11px] font-bold text-slate-200 sm:block">{user?.name || 'Owner'}</span></div>
            <button onClick={onSignOut} className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400" title="Log out"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-400">Restaurant portal</p>
          <h1 className="mt-1 text-2xl font-black text-slate-100 sm:text-3xl">Owner Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Manage your restaurant, menu, and business details in one place.</p>
        </div>

        {!ownerShop ? (
          <section className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 shadow-lg shadow-rose-500/20"><Building2 className="h-8 w-8 text-white" /></div>
            <h2 className="mt-5 text-xl font-black text-slate-100">Add your restaurant</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Join the food delivery platform and reach hungry customers in your city.</p>
            <button onClick={() => navigate('/owner-dashboard/edit-shop')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-600 hover:to-orange-600"><Plus className="h-4 w-4" /> Create your shop</button>
          </section>
        ) : (
          <>
            <h2 className="mb-5 text-xl font-black text-slate-100 sm:text-2xl">Welcome back, {ownerShop.name}</h2>
            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition hover:border-slate-700">
              <img src={ownerShop.image} alt={ownerShop.name} className="h-56 w-full object-cover sm:h-64" />
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div><h3 className="text-xl font-black text-slate-100 sm:text-2xl">{ownerShop.name}</h3><p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400"><MapPin className="h-3.5 w-3.5 text-rose-400" />{ownerShop.city}, {ownerShop.state}</p></div>
                <button onClick={() => navigate('/owner-dashboard/edit-shop')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"><Pencil className="h-3.5 w-3.5" /> Edit shop details</button>
              </div>
            </section>
            <section className="mt-6 flex flex-col items-start justify-between gap-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10"><Utensils className="h-6 w-6 text-rose-400" /></div><div><h2 className="font-black text-slate-100">Add a food item</h2><p className="mt-1 text-sm text-slate-400">Keep your menu fresh for customers.</p></div></div>
              <button onClick={() => navigate('/owner-dashboard/add-item')} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:from-rose-600 hover:to-orange-600 sm:w-auto"><Plus className="h-4 w-4" /> Add food</button>
            </section>
            <div className="mt-6"><Itemlist /></div>
          </>
        )}
      </main>
    </div>
  );
}
