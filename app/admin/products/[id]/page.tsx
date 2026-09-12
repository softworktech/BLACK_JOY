"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminImageUpload } from '@/components/admin/admin-image-upload';
import { apiGet, apiUpload, apiDelete } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    old_price: '',
    category_id: '',
    unit: '',
    stock: '',
    is_active: true,
    is_featured: false,
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiGet('/admin/categories');
        setCategories(res.data || res || []);
      } catch (error: any) {
        toast({ title: 'Error fetching categories', description: error.message, variant: 'destructive' });
      }
    };

    const fetchData = async () => {
      try {
        const prodRes = await apiGet(`/admin/products/${productId}`);
        const p = prodRes.data || prodRes;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price?.toString() || '',
          old_price: p.old_price?.toString() || '',
          category_id: p.category_id?.toString() || '',
          unit: p.unit || '',
          stock_count: p.stock_count?.toString() || p.stock?.toString() || '0',
          is_active: p.is_active ?? true,
          is_featured: p.is_featured ?? false,
        });
        if (p.image) setCurrentImageUrl(p.image);
      } catch (error: any) {
        toast({ title: 'Error fetching product', description: error.message, variant: 'destructive' });
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (productId) {
      fetchCategories().then(fetchData);
    }
  }, [productId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          data.append(key, value ? '1' : '0');
        } else if (value !== null && value !== '') {
          data.append(key, String(value));
        }
      });
      data.append('in_stock', formData.is_active ? '1' : '0');
      if (image) {
        data.append('image', image);
      }

      await apiUpload(`/admin/products/${productId}`, data, 'PUT'); 
      toast({ title: 'Product updated successfully' });
      router.push('/admin/products');
    } catch (error: any) {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiDelete(`/admin/products/${productId}`);
      toast({ title: 'Product deleted successfully' });
      router.push('/admin/products');
    } catch (error: any) {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name (পণ্যর নাম) *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (বিবরণ)</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳) *</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="old_price">Old Price (৳)</Label>
                  <Input id="old_price" name="old_price" type="number" value={formData.old_price} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory & Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category *</Label>
                  <Select value={formData.category_id} onValueChange={(v) => setFormData(prev => ({...prev, category_id: v}))}>
                    <SelectTrigger>
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
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" value={formData.unit} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_count">Stock Count</Label>
                <Input id="stock_count" name="stock_count" type="number" value={formData.stock_count} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminImageUpload value={currentImageUrl} onChange={setImage} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Active / In Stock</Label>
                  <p className="text-sm text-gray-500">Available for purchase</p>
                </div>
                <Switch checked={formData.is_active} onCheckedChange={(c) => handleSwitchChange('is_active', c)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Featured Product</Label>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
                <Switch checked={formData.is_featured} onCheckedChange={(c) => handleSwitchChange('is_featured', c)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
