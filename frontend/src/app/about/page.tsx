'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { ShieldCheck, Award, Flame, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { config } = useSiteConfig();

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary transition-colors duration-300">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col gap-16">
        {/* Go Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer -mb-8 self-start">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-bold tracking-widest text-orange-accent uppercase bg-orange-accent/10 w-fit px-3 py-1.5 rounded-full border border-orange-accent/20 mx-auto">
            {config.about_hero_subtitle || 'Our Mission'}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            {config.about_hero_title || 'ENGINEERED FOR UNCOMPROMISING SAFETY'}
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            {config.about_story_desc || 'Founded in 2026, RideX was born from a simple obsession: to design motorcycle riding gear that sets new benchmarks in protection, ergonomics, and track-proven performance.'}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-surface-raised border border-border/40 p-6 rounded-cards flex flex-col gap-4 text-center items-center">
            <div className="h-12 w-12 rounded-2xl bg-orange-accent/10 flex items-center justify-center text-orange-accent border border-orange-accent/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Impact Science</h3>
            <p className="text-sm text-text-secondary">We integrate carbon fiber, Kevlar, and D3O intelligent armor to absorb high-velocity impacts.</p>
          </div>

          <div className="bg-surface-raised border border-border/40 p-6 rounded-cards flex flex-col gap-4 text-center items-center">
            <div className="h-12 w-12 rounded-2xl bg-orange-accent/10 flex items-center justify-center text-orange-accent border border-orange-accent/20">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Rider Approved</h3>
            <p className="text-sm text-text-secondary">Tested on professional racetracks and cross-continent tours to ensure absolute durability.</p>
          </div>

          <div className="bg-surface-raised border border-border/40 p-6 rounded-cards flex flex-col gap-4 text-center items-center">
            <div className="h-12 w-12 rounded-2xl bg-orange-accent/10 flex items-center justify-center text-orange-accent border border-orange-accent/20">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Thermal Control</h3>
            <p className="text-sm text-text-secondary">Advanced ventilation channels and moisture-wicking linings keep you cool under high stress.</p>
          </div>

          <div className="bg-surface-raised border border-border/40 p-6 rounded-cards flex flex-col gap-4 text-center items-center">
            <div className="h-12 w-12 rounded-2xl bg-orange-accent/10 flex items-center justify-center text-orange-accent border border-orange-accent/20">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold">Aero Precision</h3>
            <p className="text-sm text-text-secondary">Wind-tunnel tested shapes minimize drag, helmet buffeting, and neck fatigue at high speeds.</p>
          </div>
        </div>

        {/* Brand Story Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-surface-raised border border-border/40 p-8 sm:p-12 rounded-cards">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              {config.about_story_title || 'THE RIDEX LEGACY'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {config.about_story_text1 || 'Every curve of our helmets, every stitch in our leather jackets, and every reinforcement on our riding boots is the result of meticulous engineering. We collaborate with MotoGP racers and adventure tourers to study impact points and joint flexibility.'}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              {config.about_story_text2 || 'Whether you are carving canyons, navigating daily city traffic, or setting lap times on the track, RideX ensures your focus remains entirely on the throttle. We build gear that protects your life, so you can enjoy the ride.'}
            </p>
          </div>
          <div className="h-80 rounded-xl overflow-hidden bg-canvas">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={config.about_story_image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'} alt="Motorcycle rider" className="w-full h-full object-cover" />
          </div>
        </div>
      </main>

      <Footer />
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
