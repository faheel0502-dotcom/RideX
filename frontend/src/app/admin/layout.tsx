'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Package, 
  FolderTree, 
  ShoppingBag, 
  BookOpen, 
  Mail, 
  Settings, 
  ArrowLeft, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-text-primary justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-orange-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Contact Us', href: '/admin/contact', icon: Mail },
    { name: 'About Us', href: '/admin/about', icon: BookOpen },
    { name: 'Site Config', href: '/admin/config', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-canvas text-text-primary transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/40 bg-surface-raised shrink-0">
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-wider text-orange-accent">CONTROL PANEL</span>
            <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1 mt-0.5">
              <UserCheck className="h-3 w-3" /> Admin Authorized
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-accent/10 text-orange-accent border-l-2 border-orange-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-card/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-orange-accent' : 'text-text-muted'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-card/50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-text-muted" />
            <span>Return to Store</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header / Sidebar Toggle */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden h-16 border-b border-border/40 bg-surface-raised flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-card"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-display font-bold text-md tracking-wider text-orange-accent">ADMIN PANEL</span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Store</span>
          </Link>
        </header>

        {/* Mobile Sidebar Modal overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="relative flex flex-col w-64 bg-surface-raised border-r border-border/40 h-full p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                <span className="font-display font-bold text-sm tracking-wider text-orange-accent">CONTROL PANEL</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-card"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-orange-accent/10 text-orange-accent border-l-2 border-orange-accent'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-card/50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-orange-accent' : 'text-text-muted'}`} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border/40 pt-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-card hover:bg-opacity-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 text-text-muted" />
                  <span>Return to Store</span>
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-canvas p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
