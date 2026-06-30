'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { Plus, Edit, Trash2, X, Loader2, AlertTriangle } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Destructive Delete Safeguard Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        apiFetch('/categories'),
        apiFetch('/products?limit=150')
      ]);

      if (catRes.ok) {
        setCategories(await catRes.json());
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
    } catch (err) {
      console.error('Error fetching categories data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Slug generation
  useEffect(() => {
    if (!editingCategoryId) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [name, editingCategoryId]);

  const handleOpenAddModal = () => {
    setEditingCategoryId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = { name, slug, description, imageUrl };

    try {
      const url = editingCategoryId ? `/categories/${editingCategoryId}` : '/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowFormModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save category.');
      }
    } catch (err) {
      console.error('Category form submit error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (cat: any) => {
    setDeletingCategory(cat);
    setConfirmCheckbox(false);
    setDeleteInputText('');
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);

    try {
      const res = await apiFetch(`/categories/${deletingCategory.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setShowDeleteModal(false);
        setDeletingCategory(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to delete category.');
      }
    } catch (err) {
      console.error('Delete category error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getProductsCount = (catId: string) => {
    return products.filter(p => p.categoryId === catId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">MANAGE CATEGORIES</h1>
          <p className="text-sm text-text-secondary">Create new gear categories, edit slugs, or remove catalog sections.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-orange-accent text-white font-semibold text-xs rounded-lg hover:bg-orange-hover transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-orange-accent/15 self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-10 text-text-muted">No categories created yet.</div>
          ) : (
            categories.map((cat) => {
              const productCount = getProductsCount(cat.id);
              return (
                <div 
                  key={cat.id} 
                  className="bg-surface-raised border border-border/40 p-6 rounded-cards flex flex-col justify-between hover:border-orange-accent/30 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-lg font-bold group-hover:text-orange-accent transition-colors">
                        {cat.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-accent/10 text-orange-accent">
                        {productCount} products
                      </span>
                    </div>
                    <p className="text-xs font-mono text-text-muted">/{cat.slug}</p>
                    <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-border/20 pt-4 mt-6">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-surface-card hover:bg-orange-accent/15 hover:text-orange-accent border border-border rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(cat)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-surface-card hover:bg-rose-500/15 hover:text-rose-500 border border-border rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Category Add/Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-border/40 rounded-cards w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border/40 p-5 bg-surface-card">
              <h3 className="font-display text-base font-bold">
                {editingCategoryId ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-text-secondary hover:text-orange-accent cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Category Name *</label>
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
                <label className="text-[10px] uppercase font-bold text-text-secondary">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Cover Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://image-link.jpg"
                  className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
                />
              </div>

              <div className="border-t border-border/40 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
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
                  <span>{editingCategoryId ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destructive Safeguard Delete Warning Modal */}
      {showDeleteModal && deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-rose-500/20 rounded-cards w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 border-b border-border/40 p-5 bg-rose-950/20 text-rose-500">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                DESTRUCTIVE ACTION WARNING
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-text-secondary leading-relaxed">
                You are deleting the category <strong className="text-text-primary">"{deletingCategory.name}"</strong>.
              </p>

              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg text-xs text-rose-400 space-y-2 leading-relaxed">
                <p className="font-semibold">⚠️ CRITICAL CONSEQUENCES:</p>
                <p>
                  Deleting this category **will permanently remove the category** and all of its **{getProductsCount(deletingCategory.id)} associated products**.
                </p>
                <p>
                  This will also wipe out product specifications, reviews, cart/wishlist references, and past sales catalog links. This action is destructive and **cannot be undone**.
                </p>
              </div>

              {/* Safeguard Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmCheckbox}
                  onChange={(e) => setConfirmCheckbox(e.target.checked)}
                  className="mt-0.5 rounded border-border bg-surface-card text-rose-500 focus:ring-rose-500"
                />
                <span className="text-xs text-text-secondary leading-normal">
                  I understand that this action is irreversible and all associated products will be deleted permanently.
                </span>
              </label>

              {/* Safeguard Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">
                  Type <strong className="text-rose-500">DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={deleteInputText}
                  onChange={(e) => setDeleteInputText(e.target.value)}
                  placeholder="DELETE"
                  className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>

              <div className="border-t border-border/40 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2 bg-surface-card border border-border rounded-lg text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={!confirmCheckbox || deleteInputText !== 'DELETE' || deleteLoading}
                  className="px-5 py-2 bg-rose-600 disabled:bg-rose-900/40 disabled:text-text-muted hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Permanently Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
