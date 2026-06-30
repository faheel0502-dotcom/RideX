'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { apiFetch } from '@/services/api';
import { useSiteConfig } from '@/context/SiteConfigContext';

export default function Contact() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { config } = useSiteConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message })
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        alert('Failed to submit message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary transition-colors duration-300">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        {/* Go Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-orange-accent uppercase bg-orange-accent/10 w-fit px-3 py-1.5 rounded-full border border-orange-accent/20 mx-auto">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight">CONTACT RIDER SUPPORT</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Have questions about gear sizing, order delivery, or safety certifications? Send us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="flex flex-col gap-6 bg-surface-raised border border-border/40 p-6 rounded-cards h-fit">
            <h3 className="font-display text-lg font-bold border-b border-border/40 pb-3">{(config.navbar_brand || 'RIDEX').toUpperCase()} HQ</h3>

            <div className="flex items-start gap-4 text-sm text-text-secondary">
              <MapPin className="h-5 w-5 text-orange-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary block">Store Location</span>
                <span>{config.contact_address || 'RideX Performance Center, 100 Throttle Boulevard, New Delhi, India'}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 text-sm text-text-secondary">
              <Mail className="h-5 w-5 text-orange-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary block">Email Inquiries</span>
                <span>{config.contact_email || 'support@ridex.com'}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 text-sm text-text-secondary">
              <Phone className="h-5 w-5 text-orange-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary block">Call Helpline</span>
                <span>{config.contact_phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-surface-raised border border-border/40 p-8 rounded-cards">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h3 className="font-display text-xl font-bold">Message Sent Successfully!</h3>
                <p className="text-sm text-text-secondary max-w-sm">Thank you for contacting RideX. A gear specialist will review your inquiry and reply via email shortly.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 bg-orange-accent text-white text-xs font-semibold rounded-lg hover:bg-orange-hover transition-colors cursor-pointer mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rider@example.com"
                      className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Sizing help, Shipping status..."
                    className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your question in detail here..."
                    className="bg-surface-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-fit px-8 py-3 bg-orange-accent text-white font-semibold text-sm rounded-lg hover:bg-orange-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15 self-end"
                  disabled={loading}
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
