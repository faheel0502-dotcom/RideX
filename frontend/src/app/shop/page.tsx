'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { apiFetch } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { Search, SlidersHorizontal, ArrowUpDown, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await apiFetch('/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products on filter change
  useEffect(() => {
    const fetchProds = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.set('search', searchTerm);
        if (selectedCategory) queryParams.set('category', selectedCategory);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (sortBy) queryParams.set('sort', sortBy);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9');

        const res = await apiFetch(`/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
          setTotalPages(data.pagination.pages);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProds();
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, page]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setPage(1);
    router.push('/shop');
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

        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
          <h1 className="font-display text-4xl font-bold tracking-tight">RIDING GEAR CATALOG</h1>
          <p className="text-text-secondary">Discover premium, safety-certified helmets, jackets, and accessories.</p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="flex flex-col gap-6 lg:border-r lg:border-border/40 lg:pr-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-2 font-display font-semibold">
                <SlidersHorizontal className="h-4 w-4 text-orange-accent" />
                <span>FILTERS</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs text-orange-accent hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. Helmet, Jacket..."
                  className="w-full bg-surface-raised border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Category</label>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    selectedCategory === ''
                      ? 'bg-orange-accent/10 text-orange-accent font-semibold border-l-2 border-orange-accent'
                      : 'hover:bg-surface-raised text-text-secondary'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setPage(1);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-orange-accent/10 text-orange-accent font-semibold border-l-2 border-orange-accent'
                        : 'hover:bg-surface-raised text-text-secondary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Price Range</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                />
                <span className="text-text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                />
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent appearance-none cursor-pointer"
                >
                  <option value="">Latest Arrival</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-2.5 h-4 w-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-4 bg-surface-raised rounded-cards p-6 border border-border/25">
                    <div className="h-56 bg-surface-card rounded-xl" />
                    <div className="h-4 bg-surface-card rounded w-3/4" />
                    <div className="h-4 bg-surface-card rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-raised rounded-cards border border-border/40 p-8">
                <h3 className="font-display text-xl font-bold mb-2">No Products Found</h3>
                <p className="text-sm text-text-secondary mb-6 max-w-sm">We couldn&apos;t find any riding gear matching your active filters. Try resetting them.</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-orange-accent text-white font-semibold rounded-full hover:bg-orange-hover transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="group flex flex-col gap-4 bg-surface-card border border-border hover:border-orange-accent transition-colors rounded-cards p-5"
                  >
                    <Link href={`/products/${prod.slug}`} className="h-56 rounded-xl overflow-hidden bg-canvas relative block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold tracking-widest text-orange-accent uppercase">
                        {prod.category.name}
                      </span>
                      <Link href={`/products/${prod.slug}`} className="font-display text-base font-bold truncate hover:text-orange-accent transition-colors">
                        {prod.name}
                      </Link>
                      <p className="text-xs text-text-secondary line-clamp-2">{prod.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                      <span className="text-lg font-bold text-text-primary">
                        ${Number(prod.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="p-2 bg-orange-accent text-white rounded-lg hover:bg-orange-hover transition-colors cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      page === i + 1
                        ? 'bg-orange-accent text-white'
                        : 'bg-surface-raised border border-border text-text-secondary hover:border-orange-accent hover:text-orange-accent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AIChatbox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-canvas text-text-primary justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-orange-accent border-t-transparent rounded-full" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
