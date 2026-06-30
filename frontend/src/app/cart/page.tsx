'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const tax = cartTotal * 0.18; // 18% GST
  const shipping = cartTotal > 150 || cartTotal === 0 ? 0 : 15.0;
  const total = cartTotal + tax + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary transition-colors duration-300">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        {/* Go Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>

        <h1 className="font-display text-3xl font-bold tracking-tight mb-8">SHOPPING CART</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-raised rounded-cards border border-border/40 p-8">
            <div className="h-16 w-16 rounded-full bg-orange-accent/10 flex items-center justify-center text-orange-accent border border-orange-accent/20 mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Your Cart is Empty</h3>
            <p className="text-sm text-text-secondary mb-6 max-w-sm">Looks like you haven&apos;t added any riding gears yet. Explore our premium catalog to gear up.</p>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-orange-accent text-white font-semibold rounded-full hover:bg-orange-hover transition-colors cursor-pointer"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface-card border border-border/40 p-4 rounded-cards transition-colors"
                >
                  {/* Image */}
                  <div className="h-24 w-24 rounded-lg overflow-hidden bg-canvas shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="font-display text-base font-bold hover:text-orange-accent transition-colors block truncate">
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-text-secondary font-semibold">
                      ${Number(item.product.price).toFixed(2)} each
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-border rounded-lg bg-surface-raised overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="p-2 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, Math.min(item.product.stock, item.quantity + 1))}
                      className="p-2 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/20">
                    <span className="font-bold text-base">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1.5 text-text-muted hover:text-rose-500 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-surface-raised border border-border/40 rounded-cards p-6 flex flex-col gap-6 h-fit">
              <h3 className="font-display text-lg font-bold border-b border-border/40 pb-3">ORDER SUMMARY</h3>

              <div className="flex flex-col gap-3 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="font-semibold text-text-primary">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-text-primary">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-border/40 my-2" />
                <div className="flex justify-between text-base font-bold text-text-primary">
                  <span>Total</span>
                  <span className="text-orange-accent">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full h-12 bg-orange-accent text-white font-semibold rounded-lg hover:bg-orange-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="text-[11px] text-text-muted text-center leading-relaxed">
                Free shipping on orders over $150. Safe and secure checkout.
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
