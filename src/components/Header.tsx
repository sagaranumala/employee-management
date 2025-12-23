'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('/');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActiveTab(window.location.pathname);
    }
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    ...(user?.role === 'admin' ? [{ label: 'Employees', href: '/employees', icon: <Users className="h-5 w-5" /> }] : []),
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <header className="w-full bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          EnterprisePro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition
                ${activeTab === item.href ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
              onClick={() => setActiveTab(item.href)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: User + Mobile */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition"
              >
                <span>{user.name || user.email?.split('@')[0]}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-blue-400 rounded-md shadow-lg py-2 flex flex-col">
                  <Link href="/profile" className="px-4 py-2 hover:bg-gray-700">Profile</Link>
                  <Link href="/settings" className="px-4 py-2 hover:bg-gray-700">Settings</Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-red-400 hover:bg-red-600/20 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-800/50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md transition
                ${activeTab === item.href ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
