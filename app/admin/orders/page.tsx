"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { AdminModal } from '@/components/admin/admin-modal';
import { apiGet, apiPatch, apiDelete } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();

  const fetchOrders = async (page = 1, search = '', status = 'all') => {
    setLoading(true);
    try {
      const params: any = { page };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      
      const response = await apiGet('/admin/orders', params);
      setOrders(response.data || []);
      // Laravel's default paginate puts meta at the root
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
        per_page: response.per_page
      });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch orders',
        variant: 'destructive',
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, searchTerm, statusFilter);
  }, [statusFilter]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchOrders(1, term, statusFilter);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiPatch(`/admin/orders/${id}/status`, { status });
      toast({ title: 'Status updated successfully' });
      fetchOrders(pagination.current_page, searchTerm, statusFilter);
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error: any) {
      toast({ 
        title: 'Error updating status', 
        description: error.message,
        variant: 'destructive'
      });
      // Mock success for UI interaction
      setOrders(orders.map((o: any) => o.id === id ? { ...o, status } : o) as any);
      toast({ title: 'Status updated (Mock)' });
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await apiDelete(`/admin/orders/${id}`);
      toast({ title: 'Order deleted successfully' });
      fetchOrders(pagination.current_page, searchTerm, statusFilter);
    } catch (error: any) {
      toast({ 
        title: 'Error deleting order', 
        description: error.message,
        variant: 'destructive'
      });
      // Mock delete
      setOrders(orders.filter((o: any) => o.id !== id));
      toast({ title: 'Order deleted (Mock)' });
    }
  };

  const viewOrder = async (id: number) => {
    try {
      const order = orders.find((o: any) => o.id === id);
      setSelectedOrder(order);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'confirmed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'processing': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const columns: Column[] = [
    { key: 'id', label: 'Order #', render: (row) => <span className="font-medium">#{row.id}</span> },
    { key: 'customer_name', label: 'Customer' },
    { key: 'customer_phone', label: 'Phone' },
    { key: 'total_amount', label: 'Total', render: (row) => `৳ ${row.total_amount}` },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 p-0 hover:bg-transparent">
              <Badge className={`capitalize cursor-pointer ${getStatusColor(row.status)}`} variant="outline">
                {row.status.replace(/_/g, ' ')}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
              <DropdownMenuItem 
                key={status}
                onClick={() => updateStatus(row.id, status)}
                className="capitalize"
              >
                {status.replace(/_/g, ' ')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => viewOrder(row.id)} className="h-8 w-8 text-blue-600 hover:bg-blue-50">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteOrder(row.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const ActionArea = (
    <div className="flex gap-2">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={orders}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchOrders(page, searchTerm, statusFilter)}
        onSearch={handleSearch}
        searchPlaceholder="Search order # or customer..."
        actions={ActionArea}
      />

      <AdminModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        title={`Order Details #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 w-20 inline-block">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="text-gray-500 w-20 inline-block">Phone:</span> {selectedOrder.customer_phone}</p>
                  <p><span className="text-gray-500 w-20 inline-block">Address:</span> {selectedOrder.customer_address}</p>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500 w-20">Status:</span> 
                    <Badge className={`capitalize ${getStatusColor(selectedOrder.status)}`} variant="outline">
                      {selectedOrder.status.replace(/_/g, ' ')}
                    </Badge>
                  </p>
                  <p><span className="text-gray-500 w-20 inline-block">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  {selectedOrder.order_note && <p><span className="text-gray-500 w-20 inline-block">Note:</span> <span className="text-orange-600">{selectedOrder.order_note}</span></p>}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Product</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-600">Price</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-600">Qty</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrder.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">{item.product_name}</td>
                        <td className="px-4 py-3 text-center">৳ {item.price}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium">৳ {item.line_total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-gray-500">Subtotal</td>
                      <td className="px-4 py-2 text-right font-medium">৳ {selectedOrder.subtotal}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right text-gray-500">Delivery Charge</td>
                      <td className="px-4 py-2 text-right font-medium">৳ {selectedOrder.delivery_charge}</td>
                    </tr>
                    {selectedOrder.discount_amount > 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-gray-500">Discount</td>
                        <td className="px-4 py-2 text-right font-medium text-red-500">- ৳ {selectedOrder.discount_amount}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-800">Grand Total</td>
                      <td className="px-4 py-3 text-right font-bold text-orange-600 text-lg">৳ {selectedOrder.total_amount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Print Invoice</Button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
