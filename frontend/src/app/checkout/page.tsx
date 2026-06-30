'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/services/api';
import { MapPin, Search, CreditCard, ShieldCheck, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Address Search State (Nominatim)
  const [addressQuery, setAddressQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Form Fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

  const tax = cartTotal * 0.18;
  const shipping = cartTotal > 150 ? 0 : 15.0;
  const total = cartTotal + tax + shipping;

  // Redirect if guest or cart is empty
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else if (cartItems.length === 0 && !paymentSuccess) {
      router.push('/cart');
    }
  }, [user, cartItems, router, paymentSuccess]);

  // Handle Nominatim Address Search
  const handleAddressSearch = async () => {
    if (!addressQuery.trim()) return;
    setSearchLoading(true);
    setSearchResults([]);

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&addressdetails=1&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Nominatim address search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Auto fill address on selection
  const handleSelectAddress = (result: any) => {
    const addr = result.address;
    
    const streetName = [
      addr.road,
      addr.suburb,
      addr.neighbourhood
    ].filter(Boolean).join(', ');

    setStreet(streetName || result.display_name.split(',')[0]);
    setCity(addr.city || addr.town || addr.village || addr.county || '');
    setState(addr.state || '');
    setZip(addr.postcode || '');
    setCountry(addr.country || 'India');
    
    setSearchResults([]);
    setAddressQuery('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zip || !phone) {
      alert('Please fill out all required shipping details.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in DB (Express API)
      const checkoutRes = await apiFetch('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
          shippingAddress: { street, city, state, zip, country, phone },
          paymentMethod
        })
      });

      if (checkoutRes.ok) {
        const { order } = await checkoutRes.json();

        if (paymentMethod === 'RAZORPAY') {
          // Simulate Razorpay Payment Processing
          setTimeout(async () => {
            const verifyRes = await apiFetch('/orders/verify-payment', {
              method: 'POST',
              body: JSON.stringify({
                orderId: order.id,
                gatewayPaymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
                gatewaySignature: `sig_${Math.random().toString(36).substring(2, 15)}`,
                success: true
              })
            });

            if (verifyRes.ok) {
              setPaymentSuccess(true);
              clearCart();
              setTimeout(() => {
                router.push('/orders');
              }, 2500);
            } else {
              alert('Payment verification failed. Please try again.');
              setLoading(false);
            }
          }, 2000);
        } else {
          // Cash on Delivery direct success
          setPaymentSuccess(true);
          clearCart();
          setTimeout(() => {
            router.push('/orders');
          }, 2500);
        }
      } else {
        const errorData = await checkoutRes.json();
        alert(errorData.message || 'Error creating order.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary transition-colors duration-300">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        {/* Go Back Link */}
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Cart</span>
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight mb-8">SECURE CHECKOUT</h1>

        {paymentSuccess ? (
          <div className="max-w-md mx-auto py-16 text-center bg-surface-raised border border-border/40 rounded-cards p-8 flex flex-col items-center gap-4 animate-scaleIn">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
            <h3 className="font-display text-2xl font-bold">Payment Successful!</h3>
            <p className="text-sm text-text-secondary">Your order has been placed and is being processed. Redirecting to your order history...</p>
            <div className="animate-spin h-6 w-6 border-2 border-orange-accent border-t-transparent rounded-full mt-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Center: Form */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-2 flex flex-col gap-6">
              {/* Address Search */}
              <div className="bg-surface-raised border border-border/40 rounded-cards p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <MapPin className="h-5 w-5 text-orange-accent" />
                  <h3 className="font-display text-lg font-bold">SHIPPING DESTINATION</h3>
                </div>

                {/* OpenStreetMap / Nominatim Search */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Search Location (Auto-Fill Address)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={addressQuery}
                      onChange={(e) => setAddressQuery(e.target.value)}
                      placeholder="e.g. Connaught Place, Delhi..."
                      className="flex-1 bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      className="px-4 bg-orange-accent hover:bg-orange-hover text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Search</span>
                    </button>
                  </div>

                  {searchLoading && <div className="text-xs text-orange-accent animate-pulse mt-1">Locating coordinates...</div>}

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-16 left-0 right-0 z-10 bg-surface-raised border border-border rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAddress(result)}
                          className="w-full text-left px-4 py-2.5 text-xs text-text-secondary hover:bg-surface-card hover:text-orange-accent border-b border-border/20 last:border-b-0"
                        >
                          {result.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipping Details Fields */}
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-text-secondary">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-text-secondary">State *</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-text-secondary">ZIP / Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-text-secondary">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-surface-raised border border-border/40 rounded-cards p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <CreditCard className="h-5 w-5 text-orange-accent" />
                  <h3 className="font-display text-lg font-bold">PAYMENT METHOD</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-orange-accent bg-orange-accent/5'
                      : 'border-border bg-surface-card hover:border-orange-accent/50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="text-orange-accent focus:ring-orange-accent h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Razorpay (Mock Gateway)</span>
                      <span className="text-xs text-text-muted">Debit/Credit Card, UPI, Netbanking</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-orange-accent bg-orange-accent/5'
                      : 'border-border bg-surface-card hover:border-orange-accent/50'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-orange-accent focus:ring-orange-accent h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Cash On Delivery</span>
                      <span className="text-xs text-text-muted">Pay in cash when delivered</span>
                    </div>
                  </label>
                </div>
              </div>
            </form>

            {/* Right Side: Summary & Action */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface-raised border border-border/40 rounded-cards p-6 flex flex-col gap-6">
                <h3 className="font-display text-lg font-bold border-b border-border/40 pb-3">CART ITEMS</h3>

                <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-canvas overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.product.name}</h4>
                        <span className="text-[10px] text-text-secondary">{item.quantity} x ${Number(item.product.price).toFixed(2)}</span>
                      </div>
                      <span className="text-xs font-bold">${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-4 flex flex-col gap-2.5 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-text-primary">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-text-primary">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-border/40 my-2" />
                  <div className="flex justify-between text-sm font-bold text-text-primary">
                    <span>Total Amount</span>
                    <span className="text-orange-accent">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handlePlaceOrder}
                  className="w-full h-12 bg-orange-accent text-white font-semibold rounded-lg hover:bg-orange-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{paymentMethod === 'RAZORPAY' ? 'Processing Payment...' : 'Creating Order...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{paymentMethod === 'RAZORPAY' ? 'Authorize & Pay' : 'Confirm Cash Order'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
