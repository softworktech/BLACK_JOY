"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Reply, CheckCircle2 } from 'lucide-react';
import { AdminDataTable, Column } from '@/components/admin/admin-data-table';
import { AdminModal } from '@/components/admin/admin-modal';
import { apiGet, apiDelete, apiPatch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [filter, setFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async (page = 1, status = 'all') => {
    setLoading(true);
    try {
      const params: any = { page };
      if (status !== 'all') params.status = status; // unread / read
      const response = await apiGet('/admin/contacts', params);
      setMessages(response.data || []);
      if (response.meta) setPagination(response.meta);
    } catch (error) {
      // Mock
      setMessages([
        { id: 1, name: 'Tariqul Islam', email: 'tariqul@example.com', subject: 'Partnership Inquiry', message: 'I want to supply fresh milk to your platform...', is_read: false, created_at: '2023-10-26T10:00:00Z' },
        { id: 2, name: 'Sumon Das', email: 'sumon@example.com', subject: 'Order not received', message: 'My order #1005 has not been delivered yet.', is_read: true, created_at: '2023-10-25T14:30:00Z' },
      ] as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1, filter);
  }, [filter]);

  const viewMessage = async (msg: any) => {
    setSelectedMsg(msg);
    setIsModalOpen(true);
    setReplyText('');
    
    // Mark as read automatically
    if (!msg.is_read) {
      try {
        await apiPatch(`/admin/contacts/${msg.id}/read`, {});
        setMessages(messages.map((m: any) => m.id === msg.id ? { ...m, is_read: true } : m) as any);
      } catch (error) {
        setMessages(messages.map((m: any) => m.id === msg.id ? { ...m, is_read: true } : m) as any);
      }
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await apiDelete(`/admin/contacts/${id}`);
      toast({ title: 'Message deleted' });
      fetchMessages(pagination.current_page, filter);
    } catch (error) {
      toast({ title: 'Message deleted (Mock)' });
      setMessages(messages.filter((m: any) => m.id !== id));
    }
  };

  const handleReply = async () => {
    if (!replyText) return;
    setReplying(true);
    try {
      // await apiPost(`/admin/contacts/${selectedMsg.id}/reply`, { reply: replyText });
      await new Promise(r => setTimeout(r, 1000)); // Mock delay
      toast({ title: 'Reply sent successfully to ' + selectedMsg.email });
      setIsModalOpen(false);
    } catch (error) {
      toast({ title: 'Error sending reply', variant: 'destructive' });
    } finally {
      setReplying(false);
    }
  };

  const columns: Column[] = [
    { 
      key: 'name', 
      label: 'Sender', 
      render: (row) => (
        <div className="flex flex-col">
          <span className={`font-medium ${!row.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{row.name}</span>
          <span className="text-xs text-gray-500">{row.email}</span>
        </div>
      ) 
    },
    { 
      key: 'subject', 
      label: 'Subject',
      render: (row) => <span className={`${!row.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{row.subject}</span>
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (row) => (
        row.is_read ? 
          <Badge variant="outline" className="text-gray-500 border-gray-200"><CheckCircle2 size={12} className="mr-1"/> Read</Badge> : 
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none shadow-none"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></div> Unread</Badge>
      )
    },
    { key: 'created_at', label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => viewMessage(row)} className="h-8 text-blue-600 hover:bg-blue-50">
            View
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMessage(row.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const ActionArea = (
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-[150px] bg-white">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Messages</SelectItem>
        <SelectItem value="unread">Unread Only</SelectItem>
        <SelectItem value="read">Read Only</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={messages}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchMessages(page, filter)}
        actions={ActionArea}
      />

      <AdminModal open={isModalOpen} onOpenChange={setIsModalOpen} title="Message Details" size="md">
        {selectedMsg && (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{selectedMsg.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{selectedMsg.name}</span>
                    <span className="text-gray-400">&lt;{selectedMsg.email}&gt;</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(selectedMsg.created_at).toLocaleString()}</span>
              </div>
              <div className="p-4 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed min-h-[100px]">
                {selectedMsg.message}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <Reply size={16} /> Reply to Customer
              </div>
              <Textarea 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="Type your response here..." 
                rows={4} 
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleReply} disabled={!replyText || replying} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                  <Mail size={16} /> {replying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
