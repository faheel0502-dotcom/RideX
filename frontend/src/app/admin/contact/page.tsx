'use client';

import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { apiFetch } from '@/services/api';
import { Mail, Phone, MapPin, Save, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminContact() {
  const { config, refreshConfig } = useSiteConfig();
  
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with global context on mount/update
  useEffect(() => {
    if (config) {
      setAddress(config.contact_address || '');
      setEmail(config.contact_email || '');
      setPhone(config.contact_phone || '');
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
          contact_address: address,
          contact_email: email,
          contact_phone: phone
        })
      });

      if (res.ok) {
        await refreshConfig();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save contact configurations.');
      }
    } catch (err) {
      console.error('Save contact config error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">CONTACT DETAILS MANAGEMENT</h1>
        <p className="text-sm text-text-secondary">Modify the helpline, address, and support mail rendering on the public contact page.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-raised border border-border/40 p-6 md:p-8 rounded-cards space-y-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-orange-accent" />
            <span>Store Address *</span>
          </label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="RideX Performance Center, 100 Throttle Boulevard, New Delhi, India"
            className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-orange-accent" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="support@ridex.com"
              className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-text-secondary flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-orange-accent" />
              <span>Call Helpline *</span>
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
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
            <span>Save Contact Info</span>
          </button>
        </div>
      </form>
    </div>
  );
}
