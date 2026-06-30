'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { Edit, Save, X, Loader2, DollarSign, Calendar, TrendingUp, CheckCircle, Package } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/orders/admin/list');
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error('Error fetching admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string) => {
    setUpdateLoading(true);
    try {
      const res = await apiFetch(`/orders/admin/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: orderStatus, trackingNumber })
      });

      if (res.ok) {
        setEditingOrderId(null);
        fetchOrders();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update order.');
      }
    } catch (err) {
      console.error('Update order error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Computations for sense of volume (Sec 4.3)
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + Number(ord.totalAmount), 0);
  
  const statusBreakdown = orders.reduce((acc: Record<string, number>, ord) => {
    acc[ord.status] = (acc[ord.status] || 0) + 1;
    return acc;
  }, { PENDING: 0, PAID: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">MANAGE ORDERS</h1>
        <p className="text-sm text-text-secondary">Process customer payments, update dispatch tracking, and monitor sales analytics.</p>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-raised border border-border/40 p-5 rounded-cards flex items-center gap-4">
          <div className="p-3 bg-orange-accent/10 border border-orange-accent/20 rounded-xl text-orange-accent">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Volume</span>
            <span className="text-xl font-bold font-display">{totalOrders} Orders</span>
          </div>
        </div>

        <div className="bg-surface-raised border border-border/40 p-5 rounded-cards flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Gross Income</span>
            <span className="text-xl font-bold font-display">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-surface-raised border border-border/40 p-5 rounded-cards flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Shipped</span>
            <span className="text-xl font-bold font-display">{statusBreakdown.SHIPPED} units</span>
          </div>
        </div>

        <div className="bg-surface-raised border border-border/40 p-5 rounded-cards flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-500">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Completed</span>
            <span className="text-xl font-bold font-display">{statusBreakdown.DELIVERED} units</span>
          </div>
        </div>
      </div>

      {/* Detailed Status Counts */}
      <div className="bg-surface-raised border border-border/40 p-5 rounded-cards">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-text-secondary border-b border-border/20 pb-3 mb-4">
          Status Breakdown
        </h3>
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/15">
            PENDING: {statusBreakdown.PENDING}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
            PAID: {statusBreakdown.PAID}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
            SHIPPED: {statusBreakdown.SHIPPED}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/15">
            DELIVERED: {statusBreakdown.DELIVERED}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15">
            CANCELLED: {statusBreakdown.CANCELLED}
          </span>
        </div>
      </div>

      {/* Orders Table */}
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
                  <th className="p-4 font-semibold">Order #</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold">Tracking #</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-muted">No orders found in database.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="border-b border-border/20 hover:bg-surface-card/30 transition-colors">
                      <td className="p-4 font-mono text-xs font-semibold">{ord.orderNumber}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">{ord.user?.firstName} {ord.user?.lastName}</span>
                          <span className="text-xs text-text-muted">{ord.user?.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-orange-accent">${Number(ord.totalAmount).toFixed(2)}</td>
                      <td className="p-4 text-center">
                        {editingOrderId === ord.id ? (
                          <select
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                            className="bg-surface-card border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-orange-accent cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            ord.status === 'DELIVERED' 
                              ? 'bg-purple-500/10 text-purple-400' 
                              : ord.status === 'SHIPPED' 
                              ? 'bg-cyan-500/10 text-cyan-400' 
                              : ord.status === 'PAID' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : ord.status === 'CANCELLED' 
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-orange-accent/10 text-orange-accent'
                          }`}>
                            {ord.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {editingOrderId === ord.id ? (
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Tracking Number"
                            className="bg-surface-card border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-orange-accent w-40"
                          />
                        ) : (
                          <span className="font-mono text-xs text-text-secondary">{ord.trackingNumber || 'N/A'}</span>
                        )}
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        {editingOrderId === ord.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(ord.id)}
                              disabled={updateLoading}
                              className="p-1.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 rounded cursor-pointer transition-colors"
                              title="Save"
                            >
                              {updateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="p-1.5 bg-rose-500/15 text-rose-500 border border-rose-500/20 rounded cursor-pointer transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingOrderId(ord.id);
                              setOrderStatus(ord.status);
                              setTrackingNumber(ord.trackingNumber || '');
                            }}
                            className="p-1.5 bg-surface-card hover:bg-orange-accent/15 hover:text-orange-accent border border-border rounded transition-colors cursor-pointer"
                            title="Update Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
