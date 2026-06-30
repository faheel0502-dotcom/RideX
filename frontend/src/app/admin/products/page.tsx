'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { Plus, Edit, Archive, X, Loader2, Search } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState('');
  const [specsWeight, setSpecsWeight] = useState('');
  const [specsMaterial, setSpecsMaterial] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch('/products?limit=100'),
        apiFetch('/categories')
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData || []);
      }
    } catch (err) {
      console.error('Error fetching catalog data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-generate slug
  useEffect(() => {
    if (!editingProductId) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [name, editingProductId]);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setName('');
    setSlug('');
    setDescription('');
    setPrice('');
    setSku('');
    setStock('');
    setCategoryId(categories[0]?.id || '');
    setImages('');
    setSpecsWeight('');
    setSpecsMaterial('');
    setShowModal(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setSlug(prod.slug);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setSku(prod.sku);
    setStock(prod.stock.toString());
    setCategoryId(prod.categoryId);
    setImages(prod.images.join(', '));
    setSpecsWeight(prod.specifications?.weight || '');
    setSpecsMaterial(prod.specifications?.material || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      categoryId,
      name,
      slug,
      description,
      price: parseFloat(price),
      sku,
      stock: parseInt(stock, 10),
      images: images.split(',').map(img => img.trim()).filter(Boolean),
      specifications: {
        weight: specsWeight,
        material: specsMaterial
      }
    };

    try {
      const url = editingProductId ? `/products/${editingProductId}` : '/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save product.');
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product? It will be hidden from the storefront.')) return;
    try {
      const res = await apiFetch(`/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to archive product.');
      }
    } catch (err) {
      console.error('Archive error:', err);
    }
  };

  const filteredProducts = products.filter(prod => 
    prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prod.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">MANAGE INVENTORY</h1>
          <p className="text-sm text-text-secondary">Create new products, edit listings, and control warehouse stock.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-orange-accent text-white font-semibold text-xs rounded-lg hover:bg-orange-hover transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-orange-accent/15 self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-text-muted" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or SKU..."
          className="w-full bg-surface-raised border border-border/40 rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
        />
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-accent" />
        </div>
      ) : (
        <div className="bg-surface-raised border border-border/40 rounded-cards overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-card border-b border-border/40 text-text-secondary">
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold text-right">Price</th>
                  <th className="p-4 font-semibold text-center">Stock</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-muted">No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="border-b border-border/20 hover:bg-surface-card/30 transition-colors">
                      <td className="p-4 font-mono text-xs">{prod.sku}</td>
                      <td className="p-4 font-semibold">{prod.name}</td>
                      <td className="p-4 text-text-secondary">{prod.category?.name || 'Unassigned'}</td>
                      <td className="p-4 text-right font-bold text-orange-accent">${Number(prod.price).toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          prod.stock > 5 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 bg-surface-card hover:bg-orange-accent/15 hover:text-orange-accent border border-border rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(prod.id)}
                          className="p-1.5 bg-surface-card hover:bg-rose-500/15 hover:text-rose-500 border border-border rounded transition-colors cursor-pointer"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-border/40 rounded-cards w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border/40 p-5 bg-surface-card">
              <h3 className="font-display text-lg font-bold">
                {editingProductId ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-orange-accent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Slug (Auto) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Stock *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Image URLs (comma separated) *</label>
                  <input
                    type="text"
                    required
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    placeholder="https://image1.jpg, https://image2.jpg"
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Weight (e.g. 1500g)</label>
                  <input
                    type="text"
                    value={specsWeight}
                    onChange={(e) => setSpecsWeight(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Material (e.g. Carbon Fiber)</label>
                  <input
                    type="text"
                    value={specsMaterial}
                    onChange={(e) => setSpecsMaterial(e.target.value)}
                    className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                  />
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-surface-card border border-border rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-accent text-white rounded-lg text-xs font-semibold hover:bg-orange-hover flex items-center gap-1.5 cursor-pointer"
                  disabled={formLoading}
                >
                  {formLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingProductId ? 'Update Product' : 'Add Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
