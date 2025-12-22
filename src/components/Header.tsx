'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthContext';
import { 
  Store,
  Package,
  Truck,
  Warehouse,
  ShoppingCart,
  TrendingUp,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: <Store className="h-4 w-4" /> },
    { label: 'employees', href: '/employees', icon: <Package className="h-4 w-4" /> },
    { label: 'profile', href: '/profile', icon: <User className="h-4 w-4" /> },
    // { label: 'Warehouses', href: '/warehouses', icon: <Warehouse className="h-4 w-4" /> },
    // { label: 'Purchases', href: '/purchases', icon: <ShoppingCart className="h-4 w-4" /> },
    // { label: 'Sales', href: '/sales', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Store className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StockFlow
              </span>
              <div className="text-xs text-gray-500 -mt-1">Inventory Pro</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group"
              >
                <span className="mr-2 opacity-70 group-hover:opacity-100">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Profile */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <Link href="/profile">
                      <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    </Link>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role || 'User'}
                    </p>
                  </div>
                
                  <div className="relative group">
                    <Link href="/profile">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {/* <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* <button
                               onClick={() => setShowLogoutConfirm(true)}
                               className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                             >
                               <LogOut className="h-4 w-4 mr-2" />
                               Logout
                             </button> */}
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {/* <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button> */}

          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-100"
          >
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <span className="mr-3">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <User className="h-4 w-4 mr-3" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Bar (for authenticated users) */}
      {user && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Package className="h-3 w-3 text-indigo-600 mr-2" />
                  <span className="text-gray-700">
                    <span className="font-semibold">1,245</span> Products
                  </span>
                </div>
                <div className="flex items-center">
                  <Warehouse className="h-3 w-3 text-green-600 mr-2" />
                  <span className="text-gray-700">
                    <span className="font-semibold">12</span> Warehouses
                  </span>
                </div>
                <div className="flex items-center">
                  <ShoppingCart className="h-3 w-3 text-blue-600 mr-2" />
                  <span className="text-gray-700">
                    <span className="font-semibold">$24.5K</span> Today's Sales
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="text-green-600 font-medium">
                  <span className="animate-pulse">●</span> System Online
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}