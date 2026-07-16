import Navbar from "./Navbar";
//import { FaUtensils } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

interface DashboardProps {
  user?: { name?: string; email?: string; role?: string } | null;
  onSignOut?: () => void;
}

function OwnerDashboard({ user }: DashboardProps) {
  const hasOwnerShop = useSelector((state: any) => Boolean(state.owner?.ownerShopData));
  const navigate = useNavigate()
  return (
    
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Navbar />
      
      <div className="mt-24 w-full max-w-5xl p-6 text-center">
        <h1 className="text-2xl font-bold text-[#ff4d2d]">Owner Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome, {user?.name || 'Owner'}
        </p>

        {/* {onSignOut ? (
          <button
            type="button"
            onClick={onSignOut}
            className="mt-4 rounded-lg bg-[#ff4d2d] px-4 py-2 text-sm font-semibold text-white"
          >
            Sign out
          </button>
        ) : null} */}

      </div>
      {!hasOwnerShop && (
        <div className="flex items-center justify-center flex-col bg-white rounded-2xl shadow-xl p-4 ">
          <FaUtensils className="text-[#ff4d2d]" size={40} />
          <h1 className="text-bold p-2 font-bold ">Add Your Restaurant</h1>
          <p className="flex items-center ">Join our food delivery platform and reach thousands of <br></br>hungry customers every day.</p>
          <button onClick={()=>navigate('/owner-dashboard/edit-shop')} className="bg-[#ff4d2d] p-2 rounded-xl text-[#fcfbfb] cursor-pointer ">Add Your Shop</button>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard