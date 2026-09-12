"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { AdminModal } from '@/components/admin/admin-modal';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_order: '',
    max_discount: '',
    max_uses: '',
    expires_at: '',
    is_active: true
  });

  const fetchCoupons = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiGet('/admin/coupons', { page });
      // API returns a flat array for index() instead of paginated response
      if (Array.isArray(response)) {
        setCoupons(response);
      } else {
        setCoupons(response.data || []);
        if (response.meta) setPagination(response.meta);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to fetch coupons', variant: 'destructive' });
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = (coupon: any = null) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value?.toString() || '',
        min_order: coupon.min_order?.toString() || '',
        max_discount: coupon.max_discount?.toString() || '',
        max_uses: coupon.max_uses?.toString() || '',
        expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
        is_active: coupon.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        min_order: '',
        max_discount: '',
        max_uses: '',
        expires_at: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code || !formData.value) {
      toast({ title: 'Code and Value are required', variant: 'destructive' });
      return;
    }

    try {
      // Clean up empty strings to null for backend validation
      const payload = {
        ...formData,
        min_order: formData.min_order === '' ? 0 : formData.min_order,
        max_discount: formData.max_discount === '' ? null : formData.max_discount,
        max_uses: formData.max_uses === '' ? null : formData.max_uses,
        expires_at: formData.expires_at === '' ? null : formData.expires_at,
      };

      if (editingId) {
        await apiPut(`/admin/coupons/${editingId}`, payload);
        toast({ title: 'Coupon updated' });
      } else {
        await apiPost('/admin/coupons', payload);
        toast({ title: 'Coupon created' });
      }
      setIsModalOpen(false);
      fetchCoupons(pagination.current_page);
    } catch (error: any) {
      toast({ title: 'Error saving coupon', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete coupon?')) return;
    try {
      await apiDelete(`/admin/coupons/${id}`);
      fetchCoupons(pagination.current_page);
    } catch (error) {
      setCoupons(coupons.filter((c: any) => c.id !== id));
      toast({ title: 'Deleted (Mock)' });
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await apiPut(`/admin/coupons/${id}`, { is_active: !current });
      setCoupons(coupons.map((c: any) => c.id === id ? { ...c, is_active: !current } : c) as any);
    } catch (error) {
      setCoupons(coupons.map((c: any) => c.id === id ? { ...c, is_active: !current } : c) as any);
    }
  };

  const columns: Column[] = [
    { key: 'code', label: 'Code', render: (row) => <Badge variant="outline" className="font-mono text-orange-600 bg-orange-50 border-orange-200">{row.code}</Badge> },
    { key: 'type', label: 'Type', render: (row) => <span className="capitalize">{row.type}</span> },
    { key: 'value', label: 'Value', render: (row) => row.type === 'percentage' ? `${row.value}%` : `৳ ${row.value}` },
    { key: 'min_order', label: 'Min Order', render: (row) => row.min_order ? `৳ ${row.min_order}` : 'None' },
    { key: 'usage', label: 'Usage', render: (row) => `${row.used_count || 0} / ${row.max_uses || '∞'}` },
    { key: 'expires_at', label: 'Expires', render: (row) => row.expires_at ? new Date(row.expires_at).toLocaleDateString() : 'Never' },
    { key: 'is_active', label: 'Active', render: (row) => <Switch checked={row.is_active} onCheckedChange={() => toggleActive(row.id, row.is_active)} /> },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openModal(row)} className="h-8 w-8 text-blue-600"><Pencil size={16} /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)} className="h-8 w-8 text-red-600"><Trash2 size={16} /></Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={coupons}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchCoupons}
        actions={
          <Button onClick={() => openModal()} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
            <Plus size={16} /> Add Coupon
          </Button>
        }
      />

      <AdminModal open={isModalOpen} onOpenChange={setIsModalOpen} title={editingId ? "Edit Coupon" : "Add Coupon"}>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Coupon Code *</Label>
              <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. WELCOME10" className="uppercase" />
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input type="number" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} placeholder={formData.type === 'percentage' ? "e.g. 10" : "e.g. 50"} />
            </div>
            <div className="space-y-2">
              <Label>Minimum Order Amount (৳)</Label>
              <Input type="number" value={formData.min_order} onChange={(e) => setFormData({...formData, min_order: e.target.value})} placeholder="Optional" />
            </div>
            {formData.type === 'percentage' && (
              <div className="space-y-2">
                <Label>Max Discount Amount (৳)</Label>
                <Input type="number" value={formData.max_discount} onChange={(e) => setFormData({...formData, max_discount: e.target.value})} placeholder="Optional" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Max Uses (Total)</Label>
              <Input type="number" value={formData.max_uses} onChange={(e) => setFormData({...formData, max_uses: e.target.value})} placeholder="Leave blank for unlimited" />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" value={formData.expires_at} onChange={(e) => setFormData({...formData, expires_at: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label>Active Status</Label>
            <Switch checked={formData.is_active} onCheckedChange={(c) => setFormData({...formData, is_active: c})} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Save Coupon</Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
