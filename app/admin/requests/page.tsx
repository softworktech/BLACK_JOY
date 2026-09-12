"use client";

import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { AdminModal } from '@/components/admin/admin-modal';
import { apiGet, apiPut } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const { toast } = useToast();

  const fetchRequests = async (page = 1, status = 'all') => {
    setLoading(true);
    try {
      const params: any = { page };
      if (status !== 'all') params.status = status;
      const response = await apiGet('/admin/requests', params);
      setRequests(response.data || []);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
        per_page: response.per_page
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to fetch requests', variant: 'destructive' });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1, statusFilter);
  }, [statusFilter]);

  const viewRequest = (req: any) => {
    setSelectedReq(req);
    setUpdateStatus(req.status);
    setAdminNote(req.admin_note || '');
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await apiPatch(`/admin/requests/${selectedReq.id}/status`, { status: updateStatus });
      toast({ title: 'Request status updated successfully' });
      setIsModalOpen(false);
      fetchRequests(pagination.current_page, statusFilter);
    } catch (error: any) {
      toast({ title: 'Error updating request', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: Column[] = [
    { key: 'request_id', label: 'Req ID', render: (row) => <span className="font-medium">{row.request_id}</span> },
    { key: 'name', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address', render: (row) => <span className="truncate max-w-[200px] inline-block">{row.address}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        <Badge className={`capitalize hover:bg-transparent ${getStatusColor(row.status)}`} variant="outline">
          {row.status}
        </Badge>
      )
    },
    { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => viewRequest(row)} className="h-8 text-blue-600 hover:bg-blue-50">
          <Eye size={16} className="mr-1" /> View
        </Button>
      )
    }
  ];

  const ActionArea = (
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Filter Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="reviewed">Reviewed</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={requests}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchRequests(page, statusFilter)}
        actions={ActionArea}
      />

      <AdminModal open={isModalOpen} onOpenChange={setIsModalOpen} title={`Custom Request #${selectedReq?.request_id}`} size="md">
        {selectedReq && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="text-gray-500 block">Customer</span><span className="font-medium">{selectedReq.name}</span></div>
                <div><span className="text-gray-500 block">Phone</span><span className="font-medium">{selectedReq.phone}</span></div>
                <div><span className="text-gray-500 block">Date</span><span className="font-medium">{new Date(selectedReq.created_at).toLocaleString()}</span></div>
              </div>
              <div>
                <span className="text-gray-500 block text-sm mb-1">Customer Address / Description</span>
                <p className="text-gray-800 bg-white p-3 rounded border text-sm">{selectedReq.address}</p>
              </div>
            </div>

            {selectedReq.images && selectedReq.images.length > 0 && (
              <div>
                <Label className="mb-2 block">Attached Images</Label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedReq.images.map((imgObj: any, idx: number) => (
                    <a key={idx} href={`${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://softworktech.com/SIYAM/storage'}/${imgObj.image_path}`} target="_blank" rel="noreferrer" className="shrink-0 relative group rounded-md overflow-hidden border">
                      <img src={`${process.env.NEXT_PUBLIC_STORAGE_URL || 'https://softworktech.com/SIYAM/storage'}/${imgObj.image_path}`} alt={`Attachment ${idx+1}`} className="h-24 w-24 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="text-white h-5 w-5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Admin Note (Private)</Label>
                <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Add note about pricing, availability etc..." rows={3} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button onClick={handleUpdate} className="bg-orange-500 hover:bg-orange-600 text-white">Save Changes</Button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
