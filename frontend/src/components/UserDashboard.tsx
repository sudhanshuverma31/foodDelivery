import Navbar from "../components/Navbar";

interface DashboardProps {
  user?: { name?: string; email?: string; role?: string } | null;
  onSignOut?: () => void;
}

function UserDashboard({ user, onSignOut }: DashboardProps) {
  return (
  <>
        <Navbar onSignOut={onSignOut}/>
       
    <div className="min-h-screen bg-slate-950 text-white p-6 mt-20">
     
      <div className="mx-auto max-w-5xl space-y-6 ">
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rose-400">Customer dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Welcome back, {user?.name || 'Guest'}</h1>
            <p className="mt-2 text-sm text-slate-400">Track your orders, favorites, and account activity.</p>
          </div>
          {onSignOut ? (
            <button onClick={onSignOut} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold hover:bg-rose-600">
              Sign out
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Active orders</p>
            <p className="mt-2 text-2xl font-semibold">2</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Saved addresses</p>
            <p className="mt-2 text-2xl font-semibold">3</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Loyalty points</p>
            <p className="mt-2 text-2xl font-semibold">850</p>
          </div>
        </div>
      </div>
    </div>
      </>
  )
}

export default UserDashboard
