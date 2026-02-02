"use client";

import React, { useState, useEffect } from "react";
import {
  Salad, Home, BookOpen, Calculator, TrendingUp, Calendar,
  MessageCircle, User, LogOut, Menu, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { api } from '@/services/api';
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming logged in for dashboard
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    // Optionally, clear user state and redirect
    setUser(null);
    router.push('/login'); // Redirect to login page after logout
  };

  const NavLink = ({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
        active
          ? "bg-teal-50 text-teal-700"
          : "text-gray-600 hover:text-teal-600 hover:bg-gray-50"
      )}
    >
      {children}
    </button>
  );

  const MobileNavLink = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg font-semibold transition-all w-full text-left"
    >
      {children}
    </button>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
              <Salad className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              NutriBot
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink onClick={() => router.push('/')} active={false}>
              <Home className="w-4 h-4" />
              Home
            </NavLink>
            <NavLink onClick={() => router.push('/')} active={false}>
              <BookOpen className="w-4 h-4" />
              Articles
            </NavLink>
            <NavLink onClick={() => router.push('/')} active={false}>
              <Calculator className="w-4 h-4" />
              BMI Calculator
            </NavLink>
            <NavLink onClick={() => router.push('/')} active={false}>
              <TrendingUp className="w-4 h-4" />
              Calorie Counter
            </NavLink>
            <NavLink onClick={() => router.push('/')} active={false}>
              <Calendar className="w-4 h-4" />
              Meal Planner
            </NavLink>
            <NavLink onClick={() => router.push('/dashboard')} active={false}>
              <MessageCircle className="w-4 h-4" />
              Chatbot
            </NavLink>
          </nav>

          {/* User Profile & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                  {user?.username?.[0]?.toUpperCase() || <User size={16} />}
                </div>
                <span className="font-semibold text-gray-700">{user?.username || 'Guest'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-teal-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-3">
              <MobileNavLink onClick={() => router.push('/')}>
                <Home className="w-5 h-5" />
                Home
              </MobileNavLink>
              <MobileNavLink onClick={() => router.push('/')}>
                <BookOpen className="w-5 h-5" />
                Articles
              </MobileNavLink>
              <MobileNavLink onClick={() => router.push('/')}>
                <Calculator className="w-5 h-5" />
                BMI Calculator
              </MobileNavLink>
              <MobileNavLink onClick={() => router.push('/')}>
                <TrendingUp className="w-5 h-5" />
                Calorie Counter
              </MobileNavLink>
              <MobileNavLink onClick={() => router.push('/')}>
                <Calendar className="w-5 h-5" />
                Meal Planner
              </MobileNavLink>
              <MobileNavLink onClick={() => setIsMobileMenuOpen(false)}>
                <MessageCircle className="w-5 h-5" />
                Chatbot
              </MobileNavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
