"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { apiGet, apiDelete, apiPatch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
      toast({ title: `Product updated successfully` });
      // Update local state
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

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-100';
    if (stock < 10) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const columns: Column[] = [
    { 
      key: 'image', 
      label: 'Image', 
      render: (row) => (
        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border">
          {row.image ? (
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      )
    },
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'category', label: 'Category', render: (row) => row.category?.name || 'N/A' },
    { key: 'price', label: 'Price', render: (row) => `৳ ${row.price}` },
    { 
      key: 'stock', 
      label: 'Stock', 
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(row.stock)}`}>
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
        />
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/products/${row.id}`)} className="h-8 w-8 text-blue-600 hover:bg-blue-50">
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteProduct(row.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const ActionArea = (
    <div className="flex gap-2">
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c: any) => (
            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2" onClick={() => router.push('/admin/products/new')}>
        <Plus size={16} /> Add Product
      </Button>
    </div>
  );

  return (
    <AdminDataTable
      columns={columns}
      data={products}
      loading={loading}
      pagination={pagination}
      onPageChange={(page) => fetchProducts(page, searchTerm, categoryFilter)}
      onSearch={handleSearch}
      searchPlaceholder="Search products..."
      actions={ActionArea}
    />
  );
}
