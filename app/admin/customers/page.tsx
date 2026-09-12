"use client";

import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { apiGet } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await apiGet('/admin/users', { role: 'customer', page, search });
      setCustomers(response.data || []);
      if (response.meta) setPagination(response.meta);
    } catch (error) {
      // Mock data
      setCustomers([
        { id: 1, name: 'Rahim Ali', phone: '01711223344', address: 'Rajshahi City', total_orders: 12, total_spent: 15400, last_order: '2023-10-25' },
        { id: 2, name: 'Karim Rahman', phone: '01811223344', address: 'Dhaka', total_orders: 5, total_spent: 4200, last_order: '2023-10-20' },
        { id: 3, name: 'Ayesha Siddiqua', phone: '01911223344', address: 'Bogra', total_orders: 2, total_spent: 1250, last_order: '2023-09-15' },
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1, searchTerm);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchCustomers(1, term);
  };

  const columns: Column[] = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-gray-900">{row.name}</span> },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address', render: (row) => <span className="truncate max-w-[200px] inline-block">{row.address || 'N/A'}</span> },
    { key: 'total_orders', label: 'Orders', render: (row) => <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">{row.total_orders || 0}</span> },
    { key: 'total_spent', label: 'Total Spent', render: (row) => `৳ ${row.total_spent || 0}` },
    { key: 'last_order', label: 'Last Order', render: (row) => row.last_order ? new Date(row.last_order).toLocaleDateString() : 'N/A' },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:bg-blue-50 gap-1">
          <Eye size={14} /> View History
        </Button>
      )
    }
  ];

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={customers}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchCustomers(page, searchTerm)}
        onSearch={handleSearch}
        searchPlaceholder="Search by name or phone..."
      />
    </div>
  );
}
