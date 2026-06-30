'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/services/api';

interface SiteConfig {
  site_title: string;
  navbar_brand: string;
  footer_brand: string;
  footer_text: string;
  contact_address: string;
  contact_email: string;
  contact_phone: string;
  about_hero_title: string;
  about_hero_subtitle: string;
  about_story_title: string;
  about_story_desc: string;
  about_story_text1: string;
  about_story_text2: string;
  about_story_image: string;
}

interface SiteConfigContextType {
  config: SiteConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
}

const DEFAULTS: SiteConfig = {
  site_title: "RideX | Premium Motorcycle Gears & Accessories",
  navbar_brand: "RIDEX",
  footer_brand: "RIDEX",
  footer_text: "Engineered for the ride. Offering premium riding gear, helmets, jackets, and touring accessories.",
  contact_address: "RideX Performance Center, 100 Throttle Boulevard, New Delhi, India",
  contact_email: "support@ridex.com",
  contact_phone: "+91 98765 43210",
  about_hero_title: "ENGINEERED FOR UNCOMPROMISING SAFETY",
  about_hero_subtitle: "Our Mission",
  about_story_title: "THE RIDEX LEGACY",
  about_story_desc: "Founded in 2026, RideX was born from a simple obsession: to design motorcycle riding gear that sets new benchmarks in protection, ergonomics, and track-proven performance.",
  about_story_text1: "Every curve of our helmets, every stitch in our leather jackets, and every reinforcement on our riding boots is the result of meticulous engineering. We collaborate with MotoGP racers and adventure tourers to study impact points and joint flexibility.",
  about_story_text2: "Whether you are carving canyons, navigating daily city traffic, or setting lap times on the track, RideX ensures your focus remains entirely on the throttle. We build gear that protects your life, so you can enjoy the ride.",
  about_story_image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refreshConfig = async () => {
    try {
      const res = await apiFetch('/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.error('Error fetching site config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  // Sync document title dynamically
  useEffect(() => {
    if (config.site_title) {
      document.title = config.site_title;
    }
  }, [config.site_title]);

  return (
    <SiteConfigContext.Provider value={{ config, loading, refreshConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  return context;
};
