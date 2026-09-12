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
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Modal states
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form states
  const [catName, setCatName] = useState('');
  const [catActive, setCatActive] = useState(true);
  const [catImage, setCatImage] = useState<File | null>(null);
  const [catImageUrl, setCatImageUrl] = useState('');

  const [subCatName, setSubCatName] = useState('');
  const [subCatActive, setSubCatActive] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiGet('/admin/categories');
      const cats = response.data || response || [];
      setCategories(cats);
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0]);
      }
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

  const openSubCatModal = (sub: any = null) => {
    if (sub) {
      setEditingItem(sub);
      setSubCatName(sub.name);
      setSubCatActive(sub.is_active);
    } else {
      setEditingItem(null);
      setSubCatName('');
      setSubCatActive(true);
    }
    setIsSubCatModalOpen(true);
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

  const handleSaveSubCategory = async () => {
    if (!subCatName) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    try {
      const data = {
        name: subCatName,
        is_active: subCatActive,
        category_id: selectedCategory.id
      };
      
      if (editingItem) {
        await apiPut(`/admin/subcategories/${editingItem.id}`, data);
      } else {
        await apiPost(`/admin/categories/${selectedCategory.id}/subcategories`, data);
      }
      toast({ title: 'Subcategory saved successfully' });
      setIsSubCatModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number, isSub: boolean = false) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      if (isSub) {
        await apiDelete(`/admin/subcategories/${id}`);
      } else {
        await apiDelete(`/admin/categories/${id}`);
      }
      toast({ title: 'Deleted successfully' });
      if (!isSub && selectedCategory?.id === id) setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleStatus = async (item: any, isSub: boolean = false) => {
    try {
      if (isSub) {
        await apiPut(`/admin/subcategories/${item.id}`, { 
          is_active: !item.is_active, 
          category_id: selectedCategory.id, 
          name: item.name 
        }); 
      } else {
        await apiPut(`/admin/categories/${item.id}`, { 
          is_active: !item.is_active,
          name: item.name 
        });
      }
      fetchCategories();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Categories List */}
      <Card className="lg:col-span-1 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Categories</CardTitle>
          <Button size="sm" onClick={() => openCatModal()} className="h-8 gap-1 bg-orange-500 hover:bg-orange-600 text-white">
            <Plus size={14} /> Add
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {categories.map((cat: any) => (
              <div 
                key={cat.id} 
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedCategory?.id === cat.id ? 'bg-orange-50/50 border-l-4 border-orange-500' : 'border-l-4 border-transparent'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <Folder className="text-gray-400" size={20} />}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{cat.name}</h4>
                  <p className="text-xs text-gray-500">{cat.products_count || 0} products</p>
                </div>
                <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" onClick={(e) => { e.stopPropagation(); openCatModal(cat); }}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subcategories List */}
      <Card className="lg:col-span-2 shadow-sm">
        {selectedCategory ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {selectedCategory.name} <span className="text-gray-400 font-normal text-sm">Subcategories</span>
                </CardTitle>
              </div>
              <Button size="sm" onClick={() => openSubCatModal()} className="h-8 gap-1 bg-gray-900 hover:bg-gray-800 text-white">
                <Plus size={14} /> Add Subcategory
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                  selectedCategory.subcategories.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium text-gray-900">{sub.name}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch checked={sub.is_active} onCheckedChange={() => toggleStatus(sub, true)} />
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => openSubCatModal(sub)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(sub.id, true)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No subcategories found for {selectedCategory.name}.
                  </div>
                )}
              </div>
            </CardContent>
          </>
        ) : (
          <div className="h-full flex items-center justify-center p-8 text-gray-500 flex-col gap-2 min-h-[400px]">
            <Folder size={48} className="text-gray-300" />
            <p>Select a category to view subcategories</p>
          </div>
        )}
      </Card>

      {/* Category Modal */}
      <AdminModal
        open={isCatModalOpen}
        onOpenChange={setIsCatModalOpen}
        title={editingItem ? "Edit Category" : "Add New Category"}
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Category Name *</Label>
            <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Rice" />
          </div>
          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            <AdminImageUpload value={catImageUrl} onChange={setCatImage} />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label>Active Status</Label>
            <Switch checked={catActive} onCheckedChange={setCatActive} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsCatModalOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveCategory}>Save Category</Button>
          </div>
        </div>
      </AdminModal>

      {/* Subcategory Modal */}
      <AdminModal
        open={isSubCatModalOpen}
        onOpenChange={setIsSubCatModalOpen}
        title={editingItem ? "Edit Subcategory" : `Add Subcategory to ${selectedCategory?.name}`}
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Subcategory Name *</Label>
            <Input value={subCatName} onChange={(e) => setSubCatName(e.target.value)} placeholder="e.g. Miniket" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label>Active Status</Label>
            <Switch checked={subCatActive} onCheckedChange={setSubCatActive} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsSubCatModalOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveSubCategory}>Save Subcategory</Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
