'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { CharRevealButton } from '@/components/ui/CharRevealButton';
import { StaggeredText } from '@/components/ui/StaggeredText';
import { apiFetch } from '@/services/api';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, ChevronDown } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiFetch('/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error loading products for homepage', err);
      }
    };
    fetchCatalog();
  }, []);

  // Map product array by slug
  const shoei = products.find(p => p.slug === 'shoei-x-fifteen-helmet');
  const astars = products.find(p => p.slug === 'alpinestars-gp-pro-v4-jacket');
  const dainese = products.find(p => p.slug === 'dainese-carbon-4-long-gloves');

  return (
    <div className="h-screen w-screen bg-canvas overflow-y-scroll snap-y snap-mandatory flex flex-col scroll-smooth transition-colors duration-300">
      {/* Sticky Global Navbar overlay */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
      </div>

      {/* Slide 1: INTRO HERO */}
      <section className="h-screen w-full snap-start shrink-0 relative flex items-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "var(--hero-gradient), url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-16">
          <div className="flex flex-col gap-4 text-left">
            <span className="text-[10px] font-bold tracking-widest text-orange-accent uppercase bg-orange-accent/15 px-3 py-1.5 rounded-full w-fit border border-orange-accent/25">
              RideX Studio Production
            </span>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tighter leading-[0.9] text-white uppercase">
              RIDE<br />
              <span className="text-orange-accent">FORGE</span><br />
              PRECISION
            </h1>
            <p className="text-sm text-zinc-300 max-w-sm mt-2 leading-relaxed">
              Tactile, high-octane gear floating in engineered darkness. We craft protection for those who challenge speed.
            </p>
            <div className="flex gap-4 mt-4">
              <CharRevealButton
                text="Explore shop"
                onClick={() => router.push('/shop')}
              />
              <CharRevealButton
                text="Consult AI"
                type="ghost"
                className="text-white! border-white/20! hover:border-orange-accent!"
                onClick={() => setIsAIChatOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Rotated Edge Label */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block rotate-90 origin-right text-[10px] font-mono tracking-widest text-zinc-500 select-none uppercase">
          RIDEX-1 / MOTORCYCLE LIFESTYLE
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none text-[9px] font-mono tracking-widest text-zinc-500">
          <span>SCROLL TO DISCOVER</span>
          <ChevronDown className="h-4 w-4 text-orange-accent animate-bounce" />
        </div>
      </section>

      {/* Slide 2: SHOEI HELMET */}
      <section className="h-screen w-full snap-start shrink-0 relative flex items-center bg-canvas overflow-hidden border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16 z-10">
          
          {/* Left Side: Dense Display Headline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-accent uppercase">
              MODEL 01 / AERODYNAMICS
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter leading-[0.9] text-text-primary uppercase">
              SHOEI<br />
              X-FIFTEEN<br />
              HELMET
            </h2>
            <div className="flex gap-4 mt-2">
              <CharRevealButton
                text="View Helmet Details"
                onClick={() => router.push('/products/shoei-x-fifteen-helmet')}
              />
            </div>
          </motion.div>

          {/* Right Side: Specifications Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:pl-12 text-left"
          >
            <div className="h-0.5 w-12 bg-orange-accent" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Wind-tunnel tested racing dynamics. The Shoei X-Fifteen features a multi-composite AIM+ shell configuration and high-pressure ventilation intakes, preventing helmet lift and neck buffeting at speed.
            </p>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-text-muted uppercase">
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Certification</span>
                <span className="text-text-primary">ECE 22.06 / Snell</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Material</span>
                <span className="text-text-primary">AIM+ Composite Fiber</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Weight</span>
                <span className="text-text-primary">1550 grams</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Isolated Product Image Floating in Void */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <motion.div
            whileInView={{ rotate: [0, 8, 0], scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full filter blur-[40px] bg-orange-accent/5 absolute"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            whileInView={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80"
            alt="Shoei X-Fifteen"
            className="w-[280px] md:w-[480px] object-contain drop-shadow-[0_10px_30px_rgba(255,90,0,0.1)]"
            style={{ 
              mixBlendMode: 'var(--product-blend)' as any, 
              filter: 'var(--product-filter)',
              opacity: 'var(--product-opacity)',
              WebkitMaskImage: 'var(--product-mask)',
              maskImage: 'var(--product-mask)'
            }}
          />
        </div>
      </section>

      {/* Slide 3: ALPINESTARS JACKET */}
      <section className="h-screen w-full snap-start shrink-0 relative flex items-center bg-canvas overflow-hidden border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16 z-10">
          
          {/* Left Side: Dense Display Headline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-accent uppercase">
              MODEL 02 / ABRASION PROTECTION
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter leading-[0.9] text-text-primary uppercase">
              ALPINESTARS<br />
              GP PRO V4<br />
              JACKET
            </h2>
            <div className="flex gap-4 mt-2">
              <CharRevealButton
                text="View Jacket Details"
                onClick={() => router.push('/products/alpinestars-gp-pro-v4-jacket')}
              />
            </div>
          </motion.div>

          {/* Right Side: Specifications Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:pl-12 text-left"
          >
            <div className="h-0.5 w-12 bg-orange-accent" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Designed for racing grids and aggressive street carving. Structured from 1.3mm premium bovine leather and optimized for the integration of Tech-Air 5 Airbag protection. Engineered to protect your posture.
            </p>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-text-muted uppercase">
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Material</span>
                <span className="text-text-primary">1.3mm Bovine Leather</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Armor Level</span>
                <span className="text-text-primary">CE Level 2 Protective Armor</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Airbag Ready</span>
                <span className="text-text-primary">Tech-Air 5 System Compatible</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Isolated Product Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full filter blur-[40px] bg-orange-accent/5 absolute" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            whileInView={{ y: [15, -15, 15] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1551698618-1fed5d97d256?auto=format&fit=crop&w=600&q=80"
            alt="Alpinestars Jacket"
            className="w-[280px] md:w-[480px] object-contain"
            style={{ 
              mixBlendMode: 'var(--product-blend)' as any, 
              filter: 'var(--product-filter)',
              opacity: 'var(--product-opacity)',
              WebkitMaskImage: 'var(--product-mask)',
              maskImage: 'var(--product-mask)'
            }}
          />
        </div>
      </section>

      {/* Slide 4: DAINESE GLOVES */}
      <section className="h-screen w-full snap-start shrink-0 relative flex items-center bg-canvas overflow-hidden border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16 z-10">
          
          {/* Left Side: Dense Display Headline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-accent uppercase">
              MODEL 03 / MECHANICAL SENSATION
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter leading-[0.9] text-text-primary uppercase">
              DAINESE<br />
              CARBON 4<br />
              RACE GLOVES
            </h2>
            <div className="flex gap-4 mt-2">
              <CharRevealButton
                text="View Gloves Details"
                onClick={() => router.push('/products/dainese-carbon-4-long-gloves')}
              />
            </div>
          </motion.div>

          {/* Right Side: Specifications Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:pl-12 text-left"
          >
            <div className="h-0.5 w-12 bg-orange-accent" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Track-certified tactile feel. Crafted with goatskin leather and hard carbon-fiber knuckle composites. Implements absolute grip technology across the palm.
            </p>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-text-muted uppercase">
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Material</span>
                <span className="text-text-primary">Premium Goatskin Leather</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Protection</span>
                <span className="text-text-primary">Carbon Fiber Knuckles Shell</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-1">
                <span>Grip</span>
                <span className="text-text-primary">Polyurethane palm inserts</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center: Isolated Product Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full filter blur-[40px] bg-orange-accent/5 absolute" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            whileInView={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=600&q=80"
            alt="Dainese Gloves"
            className="w-[280px] md:w-[480px] object-contain"
            style={{ 
              mixBlendMode: 'var(--product-blend)' as any, 
              filter: 'var(--product-filter)',
              opacity: 'var(--product-opacity)',
              WebkitMaskImage: 'var(--product-mask)',
              maskImage: 'var(--product-mask)'
            }}
          />
        </div>
      </section>

      {/* Slide 5: AI SERVICES INTRO */}
      <section className="h-screen w-full snap-start shrink-0 relative flex items-center bg-canvas overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16 z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-orange-accent uppercase">
              ARTIFICIAL INTELLIGENCE / CORE SYSTEM
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tighter leading-[0.9] text-text-primary uppercase">
              AI RIDER<br />
              ASSISTANT<br />
              ENGINE
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Our integrated cognitive engine assists in product search, sizing recommendations based on body geometry, and track gear set planning.
            </p>
            <div className="flex gap-4">
              <CharRevealButton
                text="Launch AI Chatbot"
                onClick={() => setIsAIChatOpen(true)}
              />
              <CharRevealButton
                text="Open Catalog"
                type="ghost"
                onClick={() => router.push('/shop')}
              />
            </div>
          </motion.div>

          <div className="bg-surface-raised border border-border/40 p-8 rounded-cards flex flex-col gap-6 text-left">
            <h3 className="font-display text-base font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-accent" />
              <span>COGNITIVE CAPABILITIES</span>
            </h3>
            <ul className="space-y-4 text-xs text-text-secondary leading-relaxed">
              <li>
                <span className="font-bold text-text-primary block">AI Sizing Advisor</span>
                Enter height, chest, and waist coordinates to calculate the optimal jacket or helmet fit.
              </li>
              <li>
                <span className="font-bold text-text-primary block">Dynamic Catalog RAG</span>
                Chat directly with our assistant to query real-time stock and comparative features.
              </li>
              <li>
                <span className="font-bold text-text-primary block">Product Q&A Console</span>
                Ask specific material or track certification questions right on the details page.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Global AI Assistant Drawer */}
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
