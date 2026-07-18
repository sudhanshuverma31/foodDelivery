import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { FaPlus } from "react-icons/fa";
import useGetCity from '../hooks/useGetCity';

interface NavbarProps {
  onSignOut?: () => Promise<void> | void;
}

function Navbar({ onSignOut }: NavbarProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
 // const [showSearch , set] = useState(true)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const menuRef = useRef<HTMLDivElement | null>(null)
  useGetCity();
  const role = useSelector((state: any) => state.auth.user?.payload?.role ?? state.auth.user?.role);
  const locationCity = useSelector((state: any) => state.location?.city ?? 'Chhituani');
  console.log("User Role in Navbar:", role);
   
   const isOwnerShop = useSelector((state: any) => Boolean(state.owner?.ownerShopData));
   console.log("Owner Shop Data in Navbar:", isOwnerShop);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    
    <div className="w-full h-[80px] flex items-center justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible ">
      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Vingo</h1>
      <div>
       
        <FaLocationDot className='text-[#ff4d2d] text-[20px] size={25}' />
        <p className='text-[14px] text-gray-500'>{locationCity}</p>
      </div>
     { role === 'user' && (
      <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] md:flex hidden'>
        <div className="flex items-center w-[30px] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
        </div>

         
        
          <div className="w-[80%] flex items-center gap-[10px] ">
            <IoSearchSharp className='text-[#ff4d2d] text-[20px] size={25}' />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for restaurants or dishes..."
              className="outline-none w-full"
            />
          </div>
        
      </div>
      )}
       {role == 'owner' && isOwnerShop &&(
          <button className="flex gap-2 items center bg-[#ff4d2d] text-white rounded-lg px-4 py-2 hover:bg-[#e53e3e] transition-colors">
            <FaPlus size={20}/>
            <span>Add Food Item </span>
          </button>
        )}
      <button
        type="button"
        onClick={() => setShowSearchModal(true)}
        className="md:hidden rounded-full bg-[#fff3ee] p-2 text-[#ff4d2d]"
        aria-label="Open search"
      >
        <IoSearchSharp className='text-[22px]' />
      </button>
     
     
     {role == 'user' && (
      <div className="relative cursor-pointer">
        <IoCartOutline className='size-8 text-[#ff4d2d]' />
        <div className="absolute top-[-10px] right-[-10px] w-[20px] h-[20px] rounded-full bg-[#ff4d2d] text-white text-[12px] flex items-center justify-center">5</div>
      </div>
     )}

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="relative cursor-pointer"
        >
          <div className="absolute top-[-10px] right-[-10px] w-[20px] h-[20px] rounded-full bg-[#ff4d2d] text-white text-[12px] flex items-center justify-center">3</div>
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile" className="w-[30px] h-[30px] rounded-full" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-3 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-2xl">
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-[#fff3ee] hover:text-[#ff4d2d]"
            >
              My Orders
            </button>
            <button
              type="button"
              onClick={async () => {
                if (onSignOut) {
                  await onSignOut();
                  navigate('/');
                }
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-[#fff3ee] hover:text-[#ff4d2d]"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      

      {showSearchModal && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/20 pt-24 md:hidden ">
          <div className="w-[90%] rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#ff4d2d]">Search</h3>
               <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
               >
                Close
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
              <IoSearchSharp className='text-[#ff4d2d] text-[20px]' />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for restaurants or dishes..."
                className="w-full outline-none"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar