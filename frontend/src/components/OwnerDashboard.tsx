import Navbar from "./Navbar";

interface DashboardProps {
  user?: { name?: string; email?: string; role?: string } | null;
  onSignOut?: () => void;
}

function OwnerDashboard({ user, onSignOut }: DashboardProps) {
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Navbar />
      <div className="mt-24 w-full max-w-5xl p-6 text-center">
        <h1 className="text-2xl font-bold text-[#ff4d2d]">Owner Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome, {user?.name || 'Owner'}
        </p>
        {onSignOut ? (
          <button
            type="button"
            onClick={onSignOut}
            className="mt-4 rounded-lg bg-[#ff4d2d] px-4 py-2 text-sm font-semibold text-white"
          >
            Sign out
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default OwnerDashboard