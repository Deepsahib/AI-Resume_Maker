import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, LogOut, Menu, X, FileText } from 'lucide-react';

const Navbar = () => {
   const [user, setUser] = useState(null);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();

   // Load user data from localStorage
   useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
         setUser(JSON.parse(userData));
      }
   }, []);

   function logoutuser(){
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsDropdownOpen(false);
      navigate('/');
   }
  return (
    <div className='sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
          <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center'>
            <FileText className='w-5 h-5 text-white' />
          </div>
          <span className='text-xl font-bold text-gray-900 hidden sm:block'>AI Resume Maker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-6'>
          {user ? (
            <>
              {/* Navigation Links */}
              <Link 
                to='/app' 
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === '/app' ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to='/app/builder/new' 
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname.includes('/builder') ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                Create Resume
              </Link>

              {/* User Dropdown */}
              <div className='relative'>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors'
                >
                  <div className='w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center'>
                    <User className='w-4 h-4 text-indigo-600' />
                  </div>
                  <span className='hidden lg:block'>Hi, {user.name || 'User'}</span>
                  <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[110]'>
                    <div className='px-4 py-2 border-b border-gray-100'>
                      <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                    </div>
                    
                    <Link
                      to='/app'
                      className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FileText className='w-4 h-4' />
                      My Resumes
                    </Link>
                    
                    <div className='border-t border-gray-100 mt-1'>
                      <button
                        onClick={logoutuser}
                        className='flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                      >
                        <LogOut className='w-4 h-4' />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Not Logged In */
            <div className='flex items-center gap-4'>
              <Link
                to='/login'
                className='text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors'
              >
                Sign In
              </Link>
              <Link
                to='/login?state=register'
                className='bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors'
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
          >
            {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200 relative z-[105]'>
          <div className='px-4 py-3 space-y-1'>
            {user ? (
              <>
                {/* User Info */}
                <div className='flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg mb-3'>
                  <div className='w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center'>
                    <User className='w-5 h-5 text-indigo-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                    <p className='text-xs text-gray-500'>{user.email}</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <Link
                  to='/app'
                  className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className='w-4 h-4' />
                  Dashboard
                </Link>
                
                <Link
                  to='/app/builder/new'
                  className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className='w-4 h-4' />
                  Create Resume
                </Link>

                <div className='border-t border-gray-200 pt-2 mt-2'>
                  <button
                    onClick={logoutuser}
                    className='flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  >
                    <LogOut className='w-4 h-4' />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              /* Not Logged In - Mobile */
              <>
                <Link
                  to='/login'
                  className='block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to='/login?state=register'
                  className='block px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className='fixed inset-0 z-[99]'
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default Navbar