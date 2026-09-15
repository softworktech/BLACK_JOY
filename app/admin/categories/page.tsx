"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Folder, Image as ImageIcon } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminModal } from '@/components/admin/admin-modal';
import { AdminImageUpload } from '@/components/admin/admin-image-upload';
import { useToast } from '@/hooks/use-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Modal states
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form states
  const [catName, setCatName] = useState('');
  const [catActive, setCatActive] = useState(true);
  const [catImage, setCatImage] = useState<File | null>(null);
  const [catImageUrl, setCatImageUrl] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiGet('/admin/categories');
      const cats = response.data || response || [];
      setCategories(cats);
    } catch (error: any) {
      toast({ title: 'Error fetching categories', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCatModal = (cat: any = null) => {
    if (cat) {
      setEditingItem(cat);
      setCatName(cat.name);
      setCatActive(cat.is_active);
      setCatImage(null);
      setCatImageUrl(cat.image);
    } else {
      setEditingItem(null);
      setCatName('');
      setCatActive(true);
      setCatImage(null);
      setCatImageUrl('');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catName) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', catName);
      formData.append('is_active', catActive ? '1' : '0');
      if (catImage) formData.append('image', catImage);

      if (editingItem) {
        await apiUpload(`/admin/categories/${editingItem.id}`, formData, 'PUT');
      } else {
        await apiUpload('/admin/categories', formData, 'POST');
      }
      toast({ title: 'Category saved successfully' });
      setIsCatModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await apiDelete(`/admin/categories/${id}`);
      toast({ title: 'Deleted successfully' });
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      await apiPut(`/admin/categories/${item.id}`, { 
        is_active: !item.is_active,
        name: item.name 
      });
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Categories</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your store's primary product categories</p>
        </div>
        <Button onClick={() => openCatModal()} className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all rounded-xl h-11 px-6">
          <Plus size={18} className="mr-2" /> Add Category
        </Button>
      </div>

      {/* Categories List View */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl h-20 border border-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="flex flex-col gap-3">
          {categories.map((cat: any) => (
            <div 
              key={cat.id} 
              className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 flex items-center p-3 sm:p-4 gap-4"
            >
              
              {/* Image / Icon */}
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                ) : (
                  <ImageIcon size={20} className="text-slate-300 group-hover:text-orange-300 transition-colors" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  {cat.products_count || 0} Products
                </p>
              </div>

              {/* Status Badge (Hidden on very small screens) */}
              <div className="hidden sm:flex items-center justify-center w-24">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:gap-6 border-l border-slate-100 pl-3 sm:pl-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Switch checked={cat.is_active} onCheckedChange={() => toggleStatus(cat)} className="data-[state=checked]:bg-orange-500 scale-75 sm:scale-100" />
                </div>
                
                <div className="flex gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" onClick={() => openCatModal(cat)}>
                    <Pencil size={14} className="sm:w-[16px] sm:h-[16px]" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" onClick={() => handleDelete(cat.id)}>
                    <Trash2 size={14} className="sm:w-[16px] sm:h-[16px]" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <ImageIcon size={40} className="text-orange-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Categories Found</h3>
          <p className="text-slate-500 mt-2 max-w-md mb-8">You haven't created any categories yet. Create your first category to start organizing your products.</p>
          <Button onClick={() => openCatModal()} className="bg-orange-500 hover:bg-orange-600 h-12 px-8 text-base rounded-xl shadow-md">
            <Plus size={20} className="mr-2" /> Add Your First Category
          </Button>
        </div>
      )}

      {/* Category Modal */}
      <AdminModal
        open={isCatModalOpen}
        onOpenChange={setIsCatModalOpen}
        title={editingItem ? "Edit Category" : "Add New Category"}
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Category Name *</Label>
            <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Smart Watches" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label>Cover Image (Optional)</Label>
            <AdminImageUpload value={catImageUrl} onChange={setCatImage} />
          </div>
          <div className="flex items-center justify-between pt-4 pb-2">
            <div>
              <Label className="text-base font-semibold">Active Status</Label>
              <p className="text-xs text-slate-500">Show this category on the website</p>
            </div>
            <Switch checked={catActive} onCheckedChange={setCatActive} className="data-[state=checked]:bg-orange-500" />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsCatModalOpen(false)} className="h-11 px-6">Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white h-11 px-8 shadow-sm" onClick={handleSaveCategory}>
              {editingItem ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
