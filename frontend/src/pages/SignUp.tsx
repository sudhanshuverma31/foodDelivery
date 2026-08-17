import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { firebaseAuth, googleProvider } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice/auth';
interface SignUpProps {
  onSuccess: (user: any) => void;
}

export default function SignUp({ onSuccess }: SignUpProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'user' as 'user' | 'owner' | 'deliveryboy'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
   
  const dispatch = useDispatch();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleSelect = (role: 'user' | 'owner' | 'deliveryboy') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }
      dispatch(setUser(data));
      navigate('/signin?registered=true');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google sign up failed.');
      }

      onSuccess(data);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900" />
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      {/* Vingo Auth Card */}
      <div className="relative z-10 max-w-[420px] w-full bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/80 shadow-2xl shadow-black/30 space-y-6">
        
        {/* Card Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">Vingo</h2>
          <p className="text-xs text-slate-400 font-medium">
            Create your account to get started with delicious food deliveries
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-900/70 text-sm border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 placeholder:text-slate-500 transition-all"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-900/70 text-sm border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 placeholder:text-slate-500 transition-all"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide">Mobile</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter your Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full bg-slate-900/70 text-sm border border-slate-700 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 placeholder:text-slate-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 tracking-wide">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-900/70 text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-slate-100 placeholder:text-slate-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 tracking-wide">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['user', 'owner', 'deliveryboy'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    formData.role === role
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 border-rose-500 text-white shadow-sm shadow-rose-500/20'
                      : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:bg-slate-700/70 hover:text-slate-200'
                  }`}
                >
                  {role === 'deliveryboy' ? 'deliveryboy' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl py-2.5 font-bold text-sm shadow-md shadow-rose-500/20 transition-colors active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Sign Up'}
          </button>
        </form>

        {/* Separator / Social Login */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-700/70 text-slate-300 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.5 3.77v3.13h4.05c2.37-2.18 3.74-5.39 3.74-9.21z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.05-3.13c-1.12.75-2.56 1.21-3.88 1.21-2.99 0-5.52-2.02-6.43-4.74H1.52v3.23A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.57 14.43A7.16 7.16 0 0 1 5.08 12c0-.85.15-1.68.41-2.43V6.34H1.52A12 12 0 0 0 0 12c0 2.07.53 4.03 1.52 5.66l4.05-3.23z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.36 2.66 1.52 6.34l4.05 3.23c.91-2.72 3.44-4.82 6.43-4.82z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Already have an account */}
          <div className="text-center">
            <span className="text-xs text-slate-400 font-medium">
              Already have an account ?{' '}
              <Link to="/signin" className="text-[#e53e3e] font-bold hover:underline">
                Sign In
              </Link>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
