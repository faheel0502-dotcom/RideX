import React from 'react';
import Link from 'next/link';
import { useSiteConfig } from '@/context/SiteConfigContext';

export const Footer: React.FC = () => {
  const { config } = useSiteConfig();

  return (
    <footer className="w-full border-t border-border bg-surface-raised py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-display text-2xl font-bold tracking-wider text-orange-accent">
              {config.footer_brand || 'RIDEX'}
            </Link>
            <p className="text-sm text-text-secondary">
              {config.footer_text || 'Engineered for the ride. Offering premium riding gear, helmets, jackets, and touring accessories.'}
            </p>
          </div>

          {/* Categories Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-text-primary">Categories</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              <li><Link href="/shop?category=helmets" className="hover:text-orange-accent transition-colors">Helmets</Link></li>
              <li><Link href="/shop?category=riding-jackets" className="hover:text-orange-accent transition-colors">Riding Jackets</Link></li>
              <li><Link href="/shop?category=riding-gloves" className="hover:text-orange-accent transition-colors">Riding Gloves</Link></li>
              <li><Link href="/shop?category=riding-boots" className="hover:text-orange-accent transition-colors">Riding Boots</Link></li>
            </ul>
          </div>

          {/* Support Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-text-primary">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-secondary">
              <li><Link href="/about" className="hover:text-orange-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-orange-accent transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-orange-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Location & Details */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display text-sm font-semibold text-text-primary">Headquarters</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {config.contact_address || 'RideX Performance Center, 100 Throttle Boulevard, New Delhi, India'}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Email: {config.contact_email || 'support@ridex.com'}<br />
              Phone: {config.contact_phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-6 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {config.footer_brand || 'RideX'}. All rights reserved. Built for safety and style.</p>
        </div>
      </div>
    </footer>
  );
};
