'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Logo, Button } from '@/components/ui';

interface MobileNavbarProps {
  className?: string;
}

export function MobileNavbar({ className = '' }: MobileNavbarProps) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('mobile-menu-button');

      if (mobileMenu && !mobileMenu.contains(event.target as Node) &&
        menuButton && !menuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="sm" />
            <span className="text-xl font-bold text-gray-900">ArambhGPT</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href="/chat"
                className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
              >
                Chat
              </Link>
            )}
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
            >
              About
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
                >
                  {user.name}
                </Link>
                <Button
                  onClick={handleSignOut}
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div
            id="mobile-menu"
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Logo size="sm" />
                <span className="text-lg font-bold text-gray-900">ArambhGPT</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col h-full">
              {/* User Info Section */}
              {isAuthenticated && user && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 py-4">
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>

                  {isAuthenticated && (
                    <Link
                      href="/chat"
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat
                    </Link>
                  )}

                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </Link>

                  {isAuthenticated && (
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-gray-200 p-4">
                {isAuthenticated ? (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Link href="/signin" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full justify-center">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMobileMenu}>
                      <Button className="w-full justify-center bg-teal-600 hover:bg-teal-700">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}