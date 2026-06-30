'use client';

import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { apiFetch } from '@/services/api';
import { FileText, Image, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminAbout() {
  const { config, refreshConfig } = useSiteConfig();

  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [storyDesc, setStoryDesc] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyText1, setStoryText1] = useState('');
  const [storyText2, setStoryText2] = useState('');
  const [storyImage, setStoryImage] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with global context on mount/update
  useEffect(() => {
    if (config) {
      setHeroSubtitle(config.about_hero_subtitle || '');
      setHeroTitle(config.about_hero_title || '');
      setStoryDesc(config.about_story_desc || '');
      setStoryTitle(config.about_story_title || '');
      setStoryText1(config.about_story_text1 || '');
      setStoryText2(config.about_story_text2 || '');
      setStoryImage(config.about_story_image || '');
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
          about_hero_subtitle: heroSubtitle,
          about_hero_title: heroTitle,
          about_story_desc: storyDesc,
          about_story_title: storyTitle,
          about_story_text1: storyText1,
          about_story_text2: storyText2,
          about_story_image: storyImage
        })
      });

      if (res.ok) {
        await refreshConfig();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save about config.');
      }
    } catch (err) {
      console.error('Save about config error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">ABOUT US CONTENT MANAGEMENT</h1>
        <p className="text-sm text-text-secondary">Modify descriptions, headers, and images rendered on the public About Us page.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-raised border border-border/40 p-6 md:p-8 rounded-cards space-y-6">
        {/* Intro Section */}
        <div className="space-y-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-orange-accent flex items-center gap-1.5 border-b border-border/20 pb-2">
            <FileText className="h-4 w-4" />
            <span>Intro Block</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Mission Label *</label>
              <input
                type="text"
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Our Mission"
                className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Hero Title *</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="ENGINEERED FOR UNCOMPROMISING SAFETY"
                className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary">Intro Paragraph *</label>
            <textarea
              required
              rows={3}
              value={storyDesc}
              onChange={(e) => setStoryDesc(e.target.value)}
              placeholder="Short paragraph describing the founding of the brand..."
              className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="space-y-4 pt-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-orange-accent flex items-center gap-1.5 border-b border-border/20 pb-2">
            <BookOpenIcon className="h-4 w-4" />
            <span>Story Block</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary">Story Title *</label>
            <input
              type="text"
              required
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="THE RIDEX LEGACY"
              className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Story Column 1 *</label>
              <textarea
                required
                rows={5}
                value={storyText1}
                onChange={(e) => setStoryText1(e.target.value)}
                placeholder="First paragraph of the brand legacy..."
                className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none leading-relaxed"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-text-secondary">Story Column 2 *</label>
              <textarea
                required
                rows={5}
                value={storyText2}
                onChange={(e) => setStoryText2(e.target.value)}
                placeholder="Second paragraph of the brand legacy..."
                className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Media Block */}
        <div className="space-y-4 pt-4">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-orange-accent flex items-center gap-1.5 border-b border-border/20 pb-2">
            <Image className="h-4 w-4" />
            <span>Illustrations</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary">Legacy Image URL *</label>
            <input
              type="text"
              required
              value={storyImage}
              onChange={(e) => setStoryImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
            />
          </div>
        </div>

        <div className="border-t border-border/20 pt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {success && (
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Changes saved successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-orange-accent text-white rounded-lg text-xs font-semibold hover:bg-orange-hover flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15 transition-all self-end"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save About Us Info</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// Icon helper since lucide doesn't have BookOpen as BookOpenIcon
function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
