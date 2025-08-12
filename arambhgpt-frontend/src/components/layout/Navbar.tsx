'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { NotificationCenter } from '@/components/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { useProfessional } from '@/hooks/useProfessional';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = '' }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const { isProfessional, professionalUser, signOutProfessional } = useProfessionalAuth();
  const { professional, isAuthenticated: isProfessionalAuthenticated, signOut: professionalSignOut } = useProfessional();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine current user type
  const isPersonalLoggedIn = isAuthenticated && user && !isProfessional && !isProfessionalAuthenticated;
  const isProfessionalLoggedIn = (isProfessional && professionalUser) || (isProfessionalAuthenticated && professional);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  const closeLoginDropdown = () => {
    setIsLoginDropdownOpen(false);
  };

  const handleSignOut = () => {
    if (isProfessionalLoggedIn) {
      // Use professional sign out from both hooks
      if (signOutProfessional) signOutProfessional();
      if (professionalSignOut) professionalSignOut();
    } else {
      signOut();
    }
    closeMobileMenu();
  };

  // Navigation items based on user type
  const getNavItems = () => {
    if (isProfessionalLoggedIn) {
      // Professional navigation - expert focused
      return [
        { href: '/', label: 'Home' },
        { href: '/professional/dashboard', label: 'Dashboard' },
        { href: '/professional/consultations', label: 'Consultations' },
        { href: '/professional/profile', label: 'Profile' },
        { href: '/professional/wallet', label: 'Wallet' },
      ];
    } else {
      // Personal user navigation - full features
      return [
        { href: '/', label: 'Home' },
        { href: '/chat', label: 'ChatWithAI' },
        { href: '/professionals', label: 'Experts' },
        { href: '/mood', label: 'Mood' },
        { href: '/wellness', label: 'Wellness' },
        { href: '/community', label: 'Community' },
        { href: '/about', label: 'About' },
      ];
    }
  };

  const navItems = getNavItems();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" onClick={closeMobileMenu}>
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActiveLink(item.href)
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-700 hover:text-teal-600 hover:border-b-2 hover:border-teal-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>



            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isProfessionalLoggedIn ? (
                <>
                  {/* Professional User Menu */}
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/professional/profile"
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Dr. {professionalUser?.name || professional?.name || 'Expert'}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : isPersonalLoggedIn ? (
                <>
                  {/* Personal User Menu */}
                  <NotificationCenter />
                  
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
                    >
                      {user.name}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest User - Login Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleLoginDropdown}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors flex items-center space-x-1"
                    >
                      <span>Login</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isLoginDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <Link
                            href="/signin"
                            onClick={closeLoginDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          >
                            👤 Personal Login
                          </Link>
                          <Link
                            href="/professional/signin"
                            onClick={closeLoginDropdown}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            👨‍⚕️ Expert Login
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>


                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}



              {/* Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {isProfessionalLoggedIn ? (
                  <>

                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : isPersonalLoggedIn ? (
                  <>

                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 px-3 py-2 text-base font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-500 border-b border-gray-200">
                      Choose Login Type:
                    </div>
                    <Link
                      href="/signin"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                    >
                      👤 Personal Login
                    </Link>
                    <Link
                      href="/professional/signin"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      👨‍⚕️ Expert Login
                    </Link>

                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}