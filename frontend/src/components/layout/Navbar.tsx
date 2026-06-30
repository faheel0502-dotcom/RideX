'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { ShoppingBag, User, Sun, Moon, Menu, X, Sparkles, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggeredText } from '../ui/StaggeredText';

interface NavbarProps {
  onOpenAIChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIChat }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { config } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Orders', href: '/orders', protected: true },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-canvas/70 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl font-bold tracking-wider text-orange-accent">
            <StaggeredText key={config.navbar_brand} text={config.navbar_brand || 'RIDEX'} delay={0.1} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest transition-colors hover:text-orange-accent ${
                    isActive ? 'text-orange-accent font-bold' : 'text-text-secondary'
                  }`}
                >
                  <StaggeredText text={link.name} delay={0.2} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* AI Assistant Button */}
          {onOpenAIChat && (
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-accent/10 text-orange-accent border border-orange-accent/20 hover:bg-orange-accent/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Expert</span>
            </button>
          )}

          {/* Cart Bag */}
          <Link href="/cart" className="relative p-2 text-text-secondary hover:text-orange-accent transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-orange-accent text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account Menu */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 p-2 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                    {user.firstName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-border bg-surface-raised py-1 shadow-lg ring-1 ring-black/5">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-card hover:text-orange-accent"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-secondary hover:bg-surface-card hover:text-orange-accent cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:border-orange-accent hover:text-orange-accent transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-text-secondary hover:text-orange-accent md:hidden transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-canvas px-4 py-4"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-text-secondary hover:text-orange-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
