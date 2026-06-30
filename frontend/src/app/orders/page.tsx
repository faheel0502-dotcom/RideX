'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/services/api';
import { ShieldCheck, Truck, ClipboardList, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';

export default function Orders() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await apiFetch('/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, router]);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PAID': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  const steps = ['Order Placed', 'Payment Verified', 'Shipped', 'Delivered'];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-text-primary justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-orange-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary transition-colors duration-300">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        {/* Go Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight mb-8">ORDER HISTORY</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-raised rounded-cards border border-border/40 p-8">
            <div className="h-16 w-16 rounded-full bg-orange-accent/10 flex items-center justify-center text-orange-accent border border-orange-accent/20 mb-4">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">No Orders Found</h3>
            <p className="text-sm text-text-secondary mb-6 max-w-sm">You haven&apos;t placed any orders yet. Once you purchase gears, they will appear here with tracking updates.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-surface-raised border border-border/40 rounded-cards p-6 flex flex-col gap-6"
                >
                  {/* Order Header Info */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-border/20">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-text-secondary">Order Number</span>
                      <span className="font-display text-sm font-bold text-text-primary">{order.orderNumber}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-text-secondary">Date Placed</span>
                      <span className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-text-secondary">Total Amount</span>
                      <span className="text-sm font-bold text-orange-accent">${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-text-secondary">Payment Status</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border w-fit ${
                        order.paymentStatus === 'COMPLETED'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline Tracker */}
                  <div className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStep;
                        return (
                          <div key={step} className="flex-1 flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-orange-accent" />
                              ) : (
                                <Circle className="h-5 w-5 text-text-muted" />
                              )}
                              <span className={`text-xs font-semibold ${isCompleted ? 'text-text-primary' : 'text-text-muted'}`}>
                                {step}
                              </span>
                            </div>
                            {idx < steps.length - 1 && (
                              <div className={`hidden sm:block flex-1 h-0.5 border-t ${
                                idx < currentStep ? 'border-orange-accent' : 'border-border/40'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="flex flex-col gap-4 mt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Items Ordered</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.orderItems.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 bg-surface-card border border-border/20 p-3 rounded-xl">
                          <div className="h-12 w-12 rounded bg-canvas overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold truncate block">{item.product.name}</span>
                            <span className="text-[10px] text-text-secondary">{item.quantity} x ${Number(item.priceAtPurchase).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping details / tracking */}
                  {order.trackingNumber && (
                    <div className="mt-2 bg-orange-accent/5 border border-orange-accent/10 p-4 rounded-xl flex items-center gap-3 text-sm text-orange-accent">
                      <Truck className="h-5 w-5 shrink-0" />
                      <div>
                        <span className="font-semibold">Shipped via Express Courier</span>
                        <p className="text-xs text-text-secondary mt-0.5">Tracking Number: <span className="font-mono font-bold text-text-primary">{order.trackingNumber}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
