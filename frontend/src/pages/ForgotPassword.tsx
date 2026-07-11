import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  async function handleOtp() {
    try {
      const response = await fetch('http://localhost:5000/api/auth/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
     console.log(data.message);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to send OTP');
    }
  }
  async function handleVerfiyOtp() {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      setStep(3);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to verify OTP');
    }
  }
  async function handleResetPassword() {
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('http://localhost:5000/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStep(1);
      navigate('/signin');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to reset password');
    }
  }

  return (

    <div className='flex justify-center items-center w-full min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className="flex item-center gap-4 mb-4">
          <ArrowLeft size={30} className="text-[#ff4d2d]" onClick={() => navigate('/signin')} />
          <h2 className="text-xl font-bold text-[#ff4d2d]  text-center ">Forgot Password</h2>
        </div>
        {step == 1 && <div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 tracking-wide">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-gray-800 placeholder:text-gray-400/80 transition-all"
            />
          </div>
          <button
            type="submit"
            // disabled={loading}
            className="w-full mt-2 bg-[#e53e3e] hover:bg-[#c53030] text-white rounded-xl py-2.5 font-bold text-sm shadow-md shadow-[#e53e3e]/10 transition-colors active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
            onClick={handleOtp}
          >
            {/* {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              : 'Send Reset Link'
            } */}
            Send Otp
          </button>
        </div>}

        {step == 2 && <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 tracking-wide">OTP</label>
          <input
            type="text"
            name="OTP"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-gray-800 placeholder:text-gray-400/80 transition-all"
          />
          <button
            type="submit"
            // disabled={loading}
            className="w-full mt-2 bg-[#e53e3e] hover:bg-[#c53030] text-white rounded-xl py-2.5 font-bold text-sm shadow-md shadow-[#e53e3e]/10 transition-colors active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
            onClick={handleVerfiyOtp}
          >
            {/* {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              : 'Send Reset Link'
            } */}
            verify
          </button>
        </div>}

        {step == 3 && <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 tracking-wide">New Password</label>
          <input
            type="text"
            name="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-gray-800 placeholder:text-gray-400/80 transition-all"
          />

          <label className="text-xs font-bold text-gray-700 tracking-wide">Confirm Password</label>
          <input
            type="text"
            name="confirmPassword"
            placeholder="Enter your confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/30 text-gray-800 placeholder:text-gray-400/80 transition-all"
          />
          <button
            type="submit"
            // disabled={loading}
            className="w-full mt-2 bg-[#e53e3e] hover:bg-[#c53030] text-white rounded-xl py-2.5 font-bold text-sm shadow-md shadow-[#e53e3e]/10 transition-colors active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
            onClick={handleResetPassword}
          >
            {/* {loading
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              : 'Send Reset Link'
            } */}
            Reset Password
          </button>
        </div>}
      </div>
    </div>
  )

}