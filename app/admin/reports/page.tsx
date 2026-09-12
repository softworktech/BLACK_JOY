"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminChart } from '@/components/admin/admin-chart';
import { AdminStatsCard } from '@/components/admin/admin-stats-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { apiGet } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [salesData, setSalesData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  const [ordersTrendData, setOrdersTrendData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [cancellationRate, setCancellationRate] = useState(0);

  const [topProductsData, setTopProductsData] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateRange.start && dateRange.end) {
        params.date_from = dateRange.start;
        params.date_to = dateRange.end;
      }

      // Fetch all reports simultaneously
      const [salesRes, ordersRes, topProductsRes, productsRes] = await Promise.all([
        apiGet('/admin/reports/sales', params),
        apiGet('/admin/reports/orders', params),
        apiGet('/admin/reports/products', params),
        apiGet('/admin/products') // For low stock
      ]);

      // Process Sales Data
      let rev = 0;
      let orderCount = 0;
      const salesArr = (Array.isArray(salesRes) ? salesRes : salesRes.data || []).map((s: any) => {
        const revVal = parseFloat(s.total_revenue) || 0;
        const ordVal = parseInt(s.total_orders) || 0;
        rev += revVal;
        orderCount += ordVal;
        return {
          date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: revVal,
          orders: ordVal
        };
      }).reverse(); // API returns desc, we want asc for chart
      
      setSalesData(salesArr);
      setTotalRevenue(rev);
      setAvgOrderValue(orderCount > 0 ? rev / orderCount : 0);
      setOrdersTrendData(salesArr);

      // Process Orders Data
      let total = 0;
      let delivered = 0;
      let cancelled = 0;
      
      const colors: any = {
        'pending': '#f59e0b',
        'processing': '#6366f1',
        'delivered': '#10b981',
        'cancelled': '#ef4444'
      };

      const ordersArr = (Array.isArray(ordersRes) ? ordersRes : ordersRes.data || []).map((o: any) => {
        const count = parseInt(o.count) || 0;
        total += count;
        if (o.status === 'delivered') delivered += count;
        if (o.status === 'cancelled') cancelled += count;
        
        return {
          name: o.status.charAt(0).toUpperCase() + o.status.slice(1),
          value: count,
          color: colors[o.status] || '#9ca3af'
        };
      });

      setOrderStatusData(ordersArr);
      setTotalOrders(total);
      setCompletionRate(total > 0 ? Math.round((delivered / total) * 100) : 0);
      setCancellationRate(total > 0 ? Math.round((cancelled / total) * 100) : 0);

      // Process Products Data
      const topProd = (Array.isArray(topProductsRes) ? topProductsRes : topProductsRes.data || []).map((p: any) => ({
        name: p.product_name,
        sales: parseInt(p.total_sold) || 0
      }));
      setTopProductsData(topProd);

      // Process Low Stock
      const allProducts = Array.isArray(productsRes) ? productsRes : productsRes.data || [];
      const lowStock = allProducts.filter((p: any) => p.stock <= 10).sort((a: any, b: any) => a.stock - b.stock).slice(0, 10);
      setLowStockProducts(lowStock);

    } catch (error: any) {
      toast({ title: 'Error loading reports', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Reports & Analytics</h2>
          <p className="text-gray-500">View detailed statistics about your business</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
          <Calendar size={16} className="text-gray-400 ml-2" />
          <Input 
            type="date" 
            className="border-0 bg-transparent h-8 w-[130px] focus-visible:ring-0 p-0 text-sm" 
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
          <span className="text-gray-400">to</span>
          <Input 
            type="date" 
            className="border-0 bg-transparent h-8 w-[130px] focus-visible:ring-0 p-0 text-sm" 
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
          <Button variant="ghost" size="sm" className="h-8 text-orange-600" onClick={fetchReports} disabled={loading}>
            {loading ? '...' : 'Apply'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminStatsCard title="Total Revenue (Delivered)" value={`৳ ${totalRevenue.toFixed(2)}`} icon={DollarSign} trend="up" trendValue="" color="green" />
            <AdminStatsCard title="Average Order Value" value={`৳ ${avgOrderValue.toFixed(2)}`} icon={TrendingUp} trend="up" trendValue="" color="blue" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Daily revenue (Delivered Orders)</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {salesData.length > 0 ? (
                  <AdminChart data={salesData} type="area" xKey="date" yKey="revenue" colors={['#10b981']} height={350} />
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-gray-400">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminStatsCard title="Total Orders" value={totalOrders.toString()} icon={ShoppingCart} trend="up" trendValue="" color="blue" />
            <AdminStatsCard title="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} trend="up" trendValue="" color="green" />
            <AdminStatsCard title="Cancellation Rate" value={`${cancellationRate}%`} icon={AlertCircle} trend="down" trendValue="" color="red" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Orders Over Time</CardTitle>
                <CardDescription>Daily delivered order volume</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersTrendData.length > 0 ? (
                  <AdminChart data={ordersTrendData} type="bar" xKey="date" yKey="orders" colors={['#3b82f6']} height={300} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">No data available</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {orderStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>By units sold</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProductsData.length > 0 ? topProductsData.map((product, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mr-4 shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-800 truncate pr-2">{product.name}</span>
                          <span className="text-gray-500 whitespace-nowrap">{product.sales} units</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(product.sales / (topProductsData[0]?.sales || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400">No sales data available</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Products with stock 10 or less</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.length > 0 ? lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={product.stock === 0 ? "text-red-600 bg-red-50 border-red-200" : "text-yellow-600 bg-yellow-50 border-yellow-200"}>
                            {product.stock} left
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-400 py-4">No low stock products</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
