"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Package, Users } from 'lucide-react';
import { AdminStatsCard } from '@/components/admin/admin-stats-card';
import { AdminChart } from '@/components/admin/admin-chart';
import { apiGet } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiGet('/admin/dashboard');
        setData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  // Map real data from API
  const stats = data || {
    total_orders: 0, total_revenue: 0, total_products: 0, total_customers: 0,
    orders_trend: '', revenue_trend: '', products_trend: '', customers_trend: ''
  };

  const revenueData = data?.monthly_revenue || [];

  const recentOrders = data?.recent_orders || [];
  
  const orderStatusDist = data?.order_status_distribution || {
    pending: 0, confirmed: 0, processing: 0, out_for_delivery: 0, delivered: 0, cancelled: 0
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AdminStatsCard 
          title="Total Orders" 
          value={stats.total_orders} 
          icon={ShoppingCart} 
          trend={stats.orders_trend ? (stats.orders_trend.startsWith('+') ? 'up' : 'down') : undefined} 
          trendValue={stats.orders_trend || ''}
          color="blue"
        />
        <AdminStatsCard 
          title="Total Revenue (৳)" 
          value={stats.total_revenue.toLocaleString()} 
          icon={DollarSign} 
          trend={stats.revenue_trend ? (stats.revenue_trend.startsWith('+') ? 'up' : 'down') : undefined} 
          trendValue={stats.revenue_trend || ''}
          color="green"
        />
        <AdminStatsCard 
          title="Total Products" 
          value={stats.total_products} 
          icon={Package} 
          trend={stats.products_trend ? (stats.products_trend.startsWith('+') ? 'up' : 'down') : undefined} 
          trendValue={stats.products_trend || ''}
          color="orange"
        />
        <AdminStatsCard 
          title="Total Customers" 
          value={stats.total_customers} 
          icon={Users} 
          trend={stats.customers_trend ? (stats.customers_trend.startsWith('+') ? 'up' : 'down') : undefined} 
          trendValue={stats.customers_trend || ''}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminChart 
            data={revenueData} 
            type="area" 
            xKey="month" 
            yKey="revenue" 
            title="Revenue Overview (Last 12 Months)" 
            colors={['#f97316']}
          />
        </div>
        <div>
          {/* Order Status Summary */}
          <Card className="h-full shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-800">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {[
                  { label: 'Pending', count: orderStatusDist.pending, color: 'bg-yellow-500' },
                  { label: 'Confirmed', count: orderStatusDist.confirmed, color: 'bg-blue-500' },
                  { label: 'Processing', count: orderStatusDist.processing, color: 'bg-indigo-500' },
                  { label: 'Out for Delivery', count: orderStatusDist.out_for_delivery, color: 'bg-purple-500' },
                  { label: 'Delivered', count: orderStatusDist.delivered, color: 'bg-green-500' },
                  { label: 'Cancelled', count: orderStatusDist.cancelled, color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-800">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>{order.customer_name || order.user?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-500">{order.customer_phone}</div>
                    </TableCell>
                    <TableCell>৳ {order.total_amount}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${getStatusColor(order.status)}`} variant="outline">
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No recent orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
