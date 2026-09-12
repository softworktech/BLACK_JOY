"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminImageUpload } from '@/components/admin/admin-image-upload';
import { apiGet, apiUpload } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiGet('/admin/categories');
        setCategories(res.data || res || []);
      } catch (error: any) {
        toast({ title: 'Error fetching categories', description: error.message, variant: 'destructive' });
      }
    };
    fetchCategories();
  }, []);

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

      await apiUpload('/admin/products', data, 'POST');
      toast({ title: 'Product created successfully' });
      router.push('/admin/products');
    } catch (error: any) {
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Product
        </Button>
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
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Miniket Rice" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (বিবরণ)</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Product details..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳) *</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="old_price">Old Price (৳)</Label>
                  <Input id="old_price" name="old_price" type="number" value={formData.old_price} onChange={handleChange} placeholder="Optional" />
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
                  <Label htmlFor="unit">Unit (e.g. 1 kg, 500 gm)</Label>
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
              <AdminImageUpload onChange={setImage} />
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
                  <p className="text-sm text-gray-500">Is this product available for purchase?</p>
                </div>
                <Switch checked={formData.is_active} onCheckedChange={(c) => handleSwitchChange('is_active', c)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Featured Product</Label>
                  <p className="text-sm text-gray-500">Show on the homepage</p>
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
