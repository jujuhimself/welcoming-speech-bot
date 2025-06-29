import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, Search, Filter, Download, Eye, Plus, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import OrderLifecycleManager from "@/components/OrderLifecycleManager";

// Update minimal Order fallback type to match OrderLifecycleManager needs
type Order = {
  id: string;
  status: string;
  pharmacyName: string;
  createdAt: string;
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    price: number;
  }>; // <-- items must match shape required by OrderLifecycleManager
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  updatedAt: string;
  urgency?: string;
  trackingNumber?: string;
  shippingAddress: string; // <-- Required for type compatibility with OrderLifecycleManager
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    if (!user || user.role !== 'retail') {
      navigate('/login');
      return;
    }

    // Remove MockDataService; leave orders empty
    setOrders([]); // If you add any default orders later, be sure they include the shippingAddress property
  }, [user, navigate]);

  const handleOrderStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          matchesDate = orderDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'confirmed': return 'bg-blue-500 text-white';
      case 'packed': return 'bg-purple-500 text-white';
      case 'shipped': return 'bg-orange-500 text-white';
      case 'out-for-delivery': return 'bg-indigo-500 text-white';
      case 'delivered': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['confirmed', 'packed', 'shipped', 'out-for-delivery'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
    urgent: orders.filter(o => o.urgency === 'urgent').length
  };

  const getTabOrders = (tab: string) => {
    switch (tab) {
      case 'pending':
        return filteredOrders.filter(o => o.status === 'pending');
      case 'active':
        return filteredOrders.filter(o => ['confirmed', 'packed', 'shipped', 'out-for-delivery'].includes(o.status));
      case 'completed':
        return filteredOrders.filter(o => o.status === 'delivered');
      default:
        return filteredOrders;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navbar removed to avoid duplicate menu */}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600 text-lg">Track and manage all your pharmacy orders</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.pending}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.active}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.delivered}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.urgent}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-indigo-100">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">TZS {(orderStats.totalValue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending ({orderStats.pending})</TabsTrigger>
              <TabsTrigger value="active">Active ({orderStats.active})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({orderStats.delivered})</TabsTrigger>
            </TabsList>
            
            <Button onClick={() => navigate('/products')}>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {['all', 'pending', 'active', 'completed'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === 'all' && 'All Orders'}
                    {tab === 'pending' && 'Pending Orders'}
                    {tab === 'active' && 'Active Orders'}
                    {tab === 'completed' && 'Completed Orders'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getTabOrders(tab).length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
                      <p className="text-gray-500 mb-6">
                        {tab === 'all' && 'Start shopping to see your orders here'}
                        {tab === 'pending' && 'No pending orders at this time'}
                        {tab === 'active' && 'No active orders in progress'}
                        {tab === 'completed' && 'No completed orders yet'}
                      </p>
                      <Button onClick={() => navigate('/products')}>
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getTabOrders(tab).map((order) => (
                        <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-3">
                              <div className="p-3 bg-blue-100 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">#{order.id}</h3>
                                  {order.urgency === 'urgent' && (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      URGENT
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-1">{order.pharmacyName}</p>
                                <p className="text-sm text-gray-500">
                                  {order.items.length} items • Created: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                TZS {order.total.toLocaleString()}
                              </div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Status</p>
                              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                {order.paymentStatus.toUpperCase()}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
                              <p className="font-medium">{order.paymentMethod.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                              <p className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <p><strong>Items:</strong> {order.items.map(item => item.name).join(', ')}</p>
                              {order.trackingNumber && (
                                <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <OrderLifecycleManager 
                                order={order} 
                                onStatusUpdate={handleOrderStatusUpdate}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
