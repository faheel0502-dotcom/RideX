'use client';

import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { apiFetch } from '@/services/api';
import { Globe, Layout, AlignLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminConfig() {
  const { config, refreshConfig } = useSiteConfig();

  const [siteTitle, setSiteTitle] = useState('');
  const [navbarBrand, setNavbarBrand] = useState('');
  const [footerBrand, setFooterBrand] = useState('');
  const [footerText, setFooterText] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with global context on mount/update
  useEffect(() => {
    if (config) {
      setSiteTitle(config.site_title || '');
      setNavbarBrand(config.navbar_brand || '');
      setFooterBrand(config.footer_brand || '');
      setFooterText(config.footer_text || '');
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await apiFetch('/config', {
        method: 'PUT',
        body: JSON.stringify({
          site_title: siteTitle,
          navbar_brand: navbarBrand,
          footer_brand: footerBrand,
          footer_text: footerText
        })
      });

      if (res.ok) {
        await refreshConfig();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save site configurations.');
      }
    } catch (err) {
      console.error('Save site config error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">SITE CONFIGURATION</h1>
        <p className="text-sm text-text-secondary">Manage site-wide brand names, footer information, and search engine title tags.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-raised border border-border/40 p-6 md:p-8 rounded-cards space-y-6">
        {/* Document Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-orange-accent" />
            <span>Browser & Search Title (&lt;title&gt;) *</span>
          </label>
          <input
            type="text"
            required
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            placeholder="RideX | Premium Motorcycle Gears & Accessories"
            className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Navbar Brand */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
              <Layout className="h-3.5 w-3.5 text-orange-accent" />
              <span>Navbar Brand Name *</span>
            </label>
            <input
              type="text"
              required
              value={navbarBrand}
              onChange={(e) => setNavbarBrand(e.target.value)}
              placeholder="RIDEX"
              className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent font-bold"
            />
          </div>

          {/* Footer Brand */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
              <Layout className="h-3.5 w-3.5 text-orange-accent" />
              <span>Footer Brand Name *</span>
            </label>
            <input
              type="text"
              required
              value={footerBrand}
              onChange={(e) => setFooterBrand(e.target.value)}
              placeholder="RIDEX"
              className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent font-bold"
            />
          </div>
        </div>

        {/* Footer Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
            <AlignLeft className="h-3.5 w-3.5 text-orange-accent" />
            <span>Footer Description Text *</span>
          </label>
          <textarea
            required
            rows={3}
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Engineered for the ride. Offering premium riding gear, helmets, jackets, and touring accessories."
            className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none leading-relaxed"
          />
        </div>

        <div className="border-t border-border/20 pt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {success && (
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Configs updated successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-orange-accent text-white rounded-lg text-xs font-semibold hover:bg-orange-hover flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15 transition-all self-end"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
