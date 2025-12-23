'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('/');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setActiveTab(window.location.pathname);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    ...(user?.role === 'admin'
      ? [{ label: 'Employees', href: '/employees', icon: <Users className="h-5 w-5" /> }]
      : []),
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <header className="header-with-line w-full bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4 md:px-8">
        <Link href="/" className="font-bold text-xl">
          EnterprisePro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden flex flex-row space-y-2 w-64">
  {navItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300
        ${activeTab === item.href 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-purple-500 text-white shadow-lg' 
          : 'hover:bg-gray-800 text-gray-300 hover:text-white hover:translate-x-1'
        }
      `}
      onClick={() => setActiveTab(item.href)}
    >
      <span className={`
        ${activeTab === item.href 
          ? 'text-purple-400' 
          : 'text-gray-400 group-hover:text-purple-400'
        }
      `}>
        {item.icon}
      </span>
      <span className="font-medium">{item.label}</span>
      {activeTab === item.href && (
        <motion.div 
          className="ml-auto w-2 h-2 rounded-full bg-purple-400"
          layoutId="activeDot"
        />
      )}
    </Link>
  ))}
</nav>

        {/* Right Menu */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition"
              >
                <span>{user.name || user.email?.split('@')[0]}</span>
                <span>({user.role})</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 flex flex-col">
                  <Link href="/profile" className="px-4 py-2 hover:bg-gray-700">Profile</Link>
                  <Link href="/settings" className="px-4 py-2 hover:bg-gray-700">Settings</Link>
                  <button onClick={logout} className="px-4 py-2 text-red-400 hover:bg-red-600/20 text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 rounded-md hover:bg-gray-800/50" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="px-3 py-2 rounded-md hover:bg-gray-700/50" onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </header>
  );
}
