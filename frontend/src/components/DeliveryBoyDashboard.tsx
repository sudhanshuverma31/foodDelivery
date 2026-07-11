interface DashboardProps {
  user?: { name?: string; email?: string; role?: string } | null;
  onSignOut?: () => void;
}

function DeliveryBoyDashboard({ user, onSignOut }: DashboardProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Delivery dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Ready for your next trip, {user?.name || 'Driver'}</h1>
            <p className="mt-2 text-sm text-slate-400">See assigned orders, routes, and delivery status.</p>
          </div>
          {onSignOut ? (
            <button onClick={onSignOut} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-600">
              Sign out
            </button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Assigned orders</p>
            <p className="mt-2 text-2xl font-semibold">5</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">On route</p>
            <p className="mt-2 text-2xl font-semibold">2</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Completed today</p>
            <p className="mt-2 text-2xl font-semibold">18</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard