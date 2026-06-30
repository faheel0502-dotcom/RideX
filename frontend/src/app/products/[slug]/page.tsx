'use client';

import React, { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { useCart } from '@/context/CartContext';
import { apiFetch } from '@/services/api';
import { ShieldCheck, Sparkles, Star, ChevronRight, Plus, Minus, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetails({ params }: PageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const { addToCart } = useCart();

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // AI Size Advisor State
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [sizeRecommendation, setSizeRecommendation] = useState<any>(null);
  const [sizeLoading, setSizeLoading] = useState(false);

  // AI Q&A State
  const [qaInput, setQaInput] = useState('');
  const [qaMessages, setQaMessages] = useState<any[]>([]);
  const [qaLoading, setQaLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiFetch(`/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setQaMessages([
            { role: 'assistant', content: `Hi! I can answer specific questions about the ${data.name}. Ask me about its materials, safety ratings, or track suitability.` }
          ]);
        }
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleIncrement = () => {
    if (quantity < (product?.stock || 1)) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleGetSizeRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chest || sizeLoading) return;

    setSizeLoading(true);
    setSizeRecommendation(null);

    try {
      const res = await apiFetch('/ai/size', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          height,
          weight,
          chest,
          waist
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSizeRecommendation(data);
      } else {
        setSizeRecommendation({
          recommendedSize: 'Refer to chart',
          confidence: 'low',
          explanation: 'Unable to calculate size. Please refer to standard sizing charts.'
        });
      }
    } catch (err) {
      console.error('Sizing error:', err);
    } finally {
      setSizeLoading(false);
    }
  };

  const handleQaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || qaLoading) return;

    const userQuestion = qaInput;
    setQaInput('');
    setQaMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setQaLoading(true);

    try {
      const res = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are the Q&A expert for the product: ${product.name}. 
Here are the product details:
Description: ${product.description}
Price: $${product.price}
Specifications: ${JSON.stringify(product.specifications)}

Answer the user's question specifically regarding this product in a concise, helpful manner.`
            },
            ...qaMessages.slice(1),
            { role: 'user', content: userQuestion }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQaMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setQaMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I failed to process that question. Please try again.' }]);
      }
    } catch (err) {
      console.error('Q&A error:', err);
    } finally {
      setQaLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-text-primary justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-orange-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-canvas text-text-primary">
        <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary transition-colors duration-300">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        {/* Breadcrumb & Back Link */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shop</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Link href="/shop" className="hover:text-orange-accent transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-orange-accent transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-text-secondary truncate">{product.name}</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side: Images */}
          <div className="flex flex-col gap-4">
            <div className="h-[450px] rounded-cards overflow-hidden bg-surface-raised border border-border/40 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0] || 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold tracking-widest text-orange-accent uppercase">
                {product.category.name}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-orange-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 5) ? 'fill-current' : 'text-text-muted'}`} />
                  ))}
                </div>
                <span className="text-xs text-text-secondary">({product.numReviews} Reviews)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-text-primary">
              ${Number(product.price).toFixed(2)}
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-xs font-medium text-text-secondary">
                {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                <div className="flex items-center border border-border rounded-lg bg-surface-raised h-12 overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="p-3 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-3 text-text-secondary hover:text-orange-accent transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 h-12 bg-orange-accent text-white font-semibold rounded-lg hover:bg-orange-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15"
                >
                  <span>Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic AI Widgets & Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Tabs (Left Side - 2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Tabs Header */}
            <div className="flex border-b border-border/40">
              {(['desc', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all uppercase tracking-wider cursor-pointer ${
                    activeTab === tab
                      ? 'border-orange-accent text-orange-accent'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'desc' ? 'Description' : tab === 'specs' ? 'Specifications' : 'Reviews'}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            <div className="bg-surface-raised rounded-cards border border-border/40 p-6 min-h-64">
              {activeTab === 'desc' && (
                <div className="text-sm text-text-secondary leading-relaxed space-y-4">
                  <p>{product.description}</p>
                  <p className="flex items-center gap-2 text-xs text-orange-accent font-semibold bg-orange-accent/5 p-3 rounded-lg border border-orange-accent/10 w-fit">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Safety Certified Product (ECE 22.06 / CE Level 2)</span>
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="text-sm text-text-secondary">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, val]: any) => (
                          <tr key={key} className="border-b border-border/20">
                            <td className="py-3 font-semibold capitalize text-text-primary w-1/3">{key}</td>
                            <td className="py-3">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-text-muted">No specifications listed for this item.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev: any) => (
                      <div key={rev.id} className="flex flex-col gap-2 pb-6 border-b border-border/20 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-text-primary">{rev.user.firstName} {rev.user.lastName}</span>
                          <div className="flex text-orange-accent">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-text-muted'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-text-muted">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-text-secondary">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-sm text-text-muted">No reviews yet. Be the first to review this gear!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Tools Column (Right Side - 1 Col) */}
          <div className="flex flex-col gap-6">
            {/* AI Size Advisor Widget */}
            <div className="bg-surface-raised rounded-cards border border-border/40 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-orange-accent border-b border-border/40 pb-3">
                <Sparkles className="h-5 w-5" />
                <h4 className="font-display font-bold text-text-primary uppercase tracking-wide">AI Size Advisor</h4>
              </div>

              <form onSubmit={handleGetSizeRecommendation} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="178"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-surface-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="75"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-surface-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Chest (inches) *</label>
                    <input
                      type="number"
                      required
                      placeholder="40"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="bg-surface-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">Waist (inches)</label>
                    <input
                      type="number"
                      placeholder="34"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="bg-surface-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-accent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-2 bg-orange-accent text-white font-semibold text-xs rounded-lg hover:bg-orange-hover transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  disabled={sizeLoading}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{sizeLoading ? 'Analyzing Fits...' : 'Get Size Recommendation'}</span>
                </button>
              </form>

              {/* Sizing Result */}
              {sizeRecommendation && (
                <div className="mt-2 bg-surface-card border border-border/40 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Recommended Size:</span>
                    <span className="px-2.5 py-0.5 rounded bg-orange-accent/20 text-orange-accent font-bold text-sm">
                      {sizeRecommendation.recommendedSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Confidence Score:</span>
                    <span className={`text-xs font-semibold capitalize ${
                      sizeRecommendation.confidence === 'high' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {sizeRecommendation.confidence}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary border-t border-border/20 pt-2 leading-relaxed">
                    {sizeRecommendation.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* AI Product Q&A Widget */}
            <div className="bg-surface-raised rounded-cards border border-border/40 p-6 flex flex-col h-[400px]">
              <div className="flex items-center gap-2 text-orange-accent border-b border-border/40 pb-3 mb-4">
                <Sparkles className="h-5 w-5" />
                <h4 className="font-display font-bold text-text-primary uppercase tracking-wide">Product Q&A</h4>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {qaMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col p-2.5 rounded-lg leading-relaxed max-w-[90%] ${
                      msg.role === 'user'
                        ? 'bg-orange-accent text-white ml-auto rounded-tr-none'
                        : 'bg-surface-card text-text-secondary border border-border/30 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {qaLoading && (
                  <div className="bg-surface-card border border-border/30 text-text-secondary rounded-lg rounded-tl-none p-2.5 max-w-[40%] flex gap-1 animate-pulse">
                    <span>•</span><span>•</span><span>•</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleQaSubmit} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-surface-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-orange-accent"
                  disabled={qaLoading}
                />
                <button
                  type="submit"
                  className="p-2 bg-orange-accent text-white rounded-lg hover:bg-orange-hover transition-colors flex items-center justify-center cursor-pointer"
                  disabled={qaLoading}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
