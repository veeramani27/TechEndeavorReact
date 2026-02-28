import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, PlusCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-slate-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tighter hover:text-blue-400 transition-all flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-sm sm:text-base">TE</span>
            </div>
            <span className="hidden sm:block">TechEndeavor</span>
          </Link>

          {/* Unified Navigation - Always Visible */}
          <div className="flex items-center gap-2 sm:gap-8">
            <Link to="/" className="text-[10px] sm:text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-[0.1em] sm:tracking-widest">
              Feed
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2 sm:gap-6">
                <Link to="/create-blog" className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 px-2 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 text-[10px] sm:text-sm whitespace-nowrap">
                  <PlusCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
                  Post Article
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 p-1 rounded-full hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600 group-hover:border-blue-500 transition-all">
                      <User size={16} className="text-slate-300 group-hover:text-blue-400 sm:w-[20px] sm:h-[20px]" />
                    </div>
                    <ChevronDown size={12} className={`text-slate-400 transition-transform sm:w-[16px] sm:h-[16px] ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 sm:w-64 bg-white rounded-xl sm:rounded-2xl shadow-2xl py-2 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
                        <p className="text-slate-900 font-bold truncate text-sm sm:text-base">{user.username}</p>
                        <p className="text-slate-500 text-[10px] sm:text-xs truncate">{user.email}</p>
                      </div>
                      <div className="py-1 sm:py-2 px-1 sm:px-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-8 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 text-xs sm:text-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
