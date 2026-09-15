"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { apiGet, apiDelete, apiPatch, apiUpload, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { AdminImageUpload } from '@/components/admin/admin-image-upload';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Drawer (Sheet) state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    old_price: '',
    category_id: '',
    unit: '',
    stock_count: '10',
    is_active: true,
    is_featured: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const fetchProducts = async (page = 1, search = '', category = 'all') => {
    setLoading(true);
    try {
      const params: any = { page };
      if (search) params.search = search;
      if (category !== 'all') params.category_id = category;
      
      const response = await apiGet('/admin/products', params);
      setProducts(response.data || response || []);
      if (response.meta) setPagination(response.meta);
    } catch (error: any) {
      toast({ title: 'Error fetching products', description: error.message, variant: 'destructive' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiGet('/admin/categories');
      setCategories(response.data || response || []);
    } catch (error: any) {
      toast({ title: 'Error fetching categories', description: error.message, variant: 'destructive' });
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(1, searchTerm, categoryFilter);
  }, [categoryFilter]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchProducts(1, term, categoryFilter);
  };

  const toggleStatus = async (id: number, field: 'is_active' | 'is_featured', currentValue: boolean) => {
    try {
      await apiPatch(`/admin/products/${id}`, { [field]: !currentValue });
      toast({ title: `Product status updated` });
      setProducts(products.map((p: any) => p.id === id ? { ...p, [field]: !currentValue } : p) as any);
    } catch (error: any) {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiDelete(`/admin/products/${id}`);
      toast({ title: 'Product deleted successfully' });
      fetchProducts(pagination.current_page, searchTerm, categoryFilter);
    } catch (error: any) {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    }
  };

  // --- Drawer Methods ---
  const openDrawerForAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      old_price: '',
      category_id: '',
      unit: '',
      stock_count: '10',
      is_active: true,
      is_featured: false,
    });
    setImage(null);
    setExistingImageUrl('');
    setIsDrawerOpen(true);
  };

  const openDrawerForEdit = async (product: any) => {
    setEditingId(product.id);
    
    // Fetch full product details just in case we need extra fields
    try {
      const res = await apiGet(`/admin/products/${product.id}`);
      const data = res.data || res;
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price ? String(data.price) : '',
        old_price: data.old_price ? String(data.old_price) : '',
        category_id: data.category_id ? String(data.category_id) : '',
        unit: data.unit || '',
        stock_count: data.stock_count !== undefined ? String(data.stock_count) : '10',
        is_active: data.is_active === 1 || data.is_active === true,
        is_featured: data.is_featured === 1 || data.is_featured === true,
      });
      setExistingImageUrl(data.image || '');
    } catch (error: any) {
      toast({ title: 'Failed to fetch product details', variant: 'destructive' });
      // Fallback to list data
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? String(product.price) : '',
        old_price: product.old_price ? String(product.old_price) : '',
        category_id: product.category_id ? String(product.category_id) : '',
        unit: product.unit || '',
        stock_count: product.stock !== undefined ? String(product.stock) : '10',
        is_active: product.is_active,
        is_featured: product.is_featured,
      });
      setExistingImageUrl(product.image || '');
    }
    
    setImage(null);
    setIsDrawerOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const submitForm = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          data.append(key, value ? '1' : '0');
        } else if (value !== null && value !== '') {
          data.append(key, String(value));
        }
      });
      data.append('in_stock', formData.is_active ? '1' : '0'); // Legacy compat
      
      // Explicitly append stock_count if it exists in form data but api expects stock
      if (formData.stock_count) {
          data.append('stock', formData.stock_count);
      }

      if (image) {
        data.append('image', image);
      }

      if (editingId) {
        await apiUpload(`/admin/products/${editingId}`, data, 'POST'); // Laravel workaround for multipart PUT via POST + _method
      } else {
        await apiUpload('/admin/products', data, 'POST');
      }

      toast({ title: `Product ${editingId ? 'updated' : 'added'} successfully!` });
      setIsDrawerOpen(false);
      fetchProducts(pagination.current_page, searchTerm, categoryFilter);
    } catch (error: any) {
      toast({ title: `Error ${editingId ? 'updating' : 'creating'} product`, description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-700 bg-red-100 border-red-200';
    if (stock < 10) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-green-700 bg-green-100 border-green-200';
  };

  const columns: Column[] = [
    { 
      key: 'image', 
      label: 'Image', 
      render: (row) => (
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
          {row.image ? (
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-300" />
          )}
        </div>
      )
    },
    { 
      key: 'name', 
      label: 'Name', 
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block line-clamp-1">{row.name}</span>
          {row.unit && <span className="text-xs text-slate-500 mt-0.5 block">{row.unit}</span>}
        </div>
      ) 
    },
    { 
      key: 'category', 
      label: 'Category', 
      render: (row) => (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
          {row.category?.name || 'N/A'}
        </span>
      )
    },
    { 
      key: 'price', 
      label: 'Price', 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">৳ {row.price}</span>
          {row.old_price && <span className="text-xs text-slate-400 line-through">৳ {row.old_price}</span>}
        </div>
      ) 
    },
    { 
      key: 'stock', 
      label: 'Stock', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStockColor(row.stock)}`}>
          {row.stock} {row.stock === 0 ? '(Out)' : ''}
        </span>
      )
    },
    { 
      key: 'is_featured', 
      label: 'Featured', 
      render: (row) => (
        <Switch 
          checked={row.is_featured} 
          onCheckedChange={() => toggleStatus(row.id, 'is_featured', row.is_featured)} 
          className="data-[state=checked]:bg-orange-500"
        />
      )
    },
    { 
      key: 'is_active', 
      label: 'Active', 
      render: (row) => (
        <Switch 
          checked={row.is_active} 
          onCheckedChange={() => toggleStatus(row.id, 'is_active', row.is_active)} 
          className="data-[state=checked]:bg-green-500"
        />
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => openDrawerForEdit(row)} className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Pencil size={14} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteProduct(row.id)} className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  const ActionArea = (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-200">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c: any) => (
            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-sm rounded-lg" onClick={openDrawerForAdd}>
        <Plus size={16} /> Add Product
      </Button>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Products</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your store's inventory and product details</p>
          </div>
        </div>

        <AdminDataTable
          columns={columns}
          data={products}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => fetchProducts(page, searchTerm, categoryFilter)}
          onSearch={handleSearch}
          searchPlaceholder="Search products by name..."
          actions={ActionArea}
        />
      </div>

      {/* Side Drawer for Add/Edit Product */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-md md:max-w-2xl overflow-y-auto bg-slate-50 p-0 border-l border-slate-200 shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </SheetTitle>
              <SheetDescription>
                {editingId ? 'Update the details of your existing product.' : 'Fill in the details below to add a new product to your store.'}
              </SheetDescription>
            </SheetHeader>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Basic Info */}
            <Card className="p-5 border-slate-200 shadow-sm rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Product Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. Premium Smart Watch" className="border-slate-200 focus-visible:ring-orange-500" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleFormChange} rows={4} placeholder="Detail about the product..." className="border-slate-200 focus-visible:ring-orange-500 resize-none" />
              </div>
            </Card>

            {/* Pricing & Category */}
            <Card className="p-5 border-slate-200 shadow-sm rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Pricing & Organization</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-700">Price (৳) <span className="text-red-500">*</span></Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="0.00" className="border-slate-200 focus-visible:ring-orange-500" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="old_price" className="text-slate-700">Old Price (৳)</Label>
                  <Input id="old_price" name="old_price" type="number" value={formData.old_price} onChange={handleFormChange} placeholder="0.00" className="border-slate-200 focus-visible:ring-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id" className="text-slate-700">Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.category_id} onValueChange={(v) => setFormData(prev => ({...prev, category_id: v}))}>
                    <SelectTrigger className="border-slate-200 focus:ring-orange-500">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-slate-700">Unit</Label>
                  <Input id="unit" name="unit" value={formData.unit} onChange={handleFormChange} placeholder="e.g. 1 pcs, 1 kg" className="border-slate-200 focus-visible:ring-orange-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_count" className="text-slate-700">Available Stock</Label>
                <Input id="stock_count" name="stock_count" type="number" value={formData.stock_count} onChange={handleFormChange} className="border-slate-200 focus-visible:ring-orange-500" />
              </div>
            </Card>

            {/* Media */}
            <Card className="p-5 border-slate-200 shadow-sm rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b pb-2">Product Image</h3>
              <AdminImageUpload 
                value={existingImageUrl} 
                onChange={(file) => {
                  setImage(file);
                  if(!file) setExistingImageUrl(''); // Clear existing if file is removed
                }} 
              />
            </Card>

            {/* Status */}
            <Card className="p-5 border-slate-200 shadow-sm rounded-xl space-y-5">
              <h3 className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">Visibility Status</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-slate-800">Active / Published</Label>
                  <p className="text-xs text-slate-500">Is this product visible on the website?</p>
                </div>
                <Switch checked={formData.is_active} onCheckedChange={(c) => handleSwitchChange('is_active', c)} className="data-[state=checked]:bg-green-500" />
              </div>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base text-slate-800">Featured Product</Label>
                  <p className="text-xs text-slate-500">Show this product on the homepage</p>
                </div>
                <Switch checked={formData.is_featured} onCheckedChange={(c) => handleSwitchChange('is_featured', c)} className="data-[state=checked]:bg-orange-500" />
              </div>
            </Card>
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="border-slate-300">
              Cancel
            </Button>
            <Button onClick={submitForm} disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]">
              {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {editingId ? 'Save Changes' : 'Publish Product'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
