import Navbar from "./Navbar";
//import { FaUtensils } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

interface DashboardProps {
  user?: { name?: string; email?: string; role?: string } | null;
  onSignOut?: () => void;
}

function OwnerDashboard({ user, onSignOut }: DashboardProps) {
  const hasOwnerShopData = useSelector((state: any) => state.owner.ownerShopData);
  console.log(hasOwnerShopData);
  const navigate = useNavigate()
  return (
    
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      <Navbar onSignOut={onSignOut} />
      
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
      {!hasOwnerShopData && (
        <div className="flex items-center justify-center flex-col bg-white rounded-2xl shadow-xl p-4 ">
          <FaUtensils className="text-[#ff4d2d]" size={40} />
          <h1 className="text-bold p-2 font-bold ">Add Your Restaurant</h1>
          <p className="flex items-center ">Join our food delivery platform and reach thousands of <br></br>hungry customers every day.</p>
          <button onClick={()=>navigate('/owner-dashboard/edit-shop')} className="bg-[#ff4d2d] p-2 rounded-xl text-[#fcfbfb] cursor-pointer ">Add Your Shop</button>
        </div>
      )}
    {hasOwnerShopData && (
         <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6 ">
            <h1 className="text-2xl sm:text-3xl text-grey-900 flex items-center gap-3 mt-8  text-center ">Welcome to {hasOwnerShopData.name}</h1>
          
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl raltive">
            <img src={hasOwnerShopData.image} alt={hasOwnerShopData.name} className="w-full h-60 object-cover"/> 
              <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2">{hasOwnerShopData.name}</h1>
            <p className="text-gray-500 ">{hasOwnerShopData.city} , {hasOwnerShopData.state}</p>
              </div>
          </div>
             
          </div>

    )}
    </div>
  );
}

export default OwnerDashboard