
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, ShoppingCart, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalPharmacies: 0,
    pendingApprovals: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });
  const [pendingPharmacies, setPendingPharmacies] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Load admin stats
    const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const users = JSON.parse(localStorage.getItem('bepawa_users') || '[]');
    const products = JSON.parse(localStorage.getItem('bepawa_products') || '[]');
    
    const pharmacies = users.filter((u: any) => u.role === 'pharmacy');
    const pending = pharmacies.filter((p: any) => !p.isApproved);
    const lowStock = products.filter((p: any) => p.stock < 50);

    setStats({
      totalOrders: orders.length,
      pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
      totalPharmacies: pharmacies.length,
      pendingApprovals: pending.length,
      totalProducts: products.length,
      lowStockProducts: lowStock.length
    });

    setPendingPharmacies(pending);
    setRecentOrders(orders.slice(0, 10));
  }, [user, navigate]);

  const approvePharmacy = (pharmacyId: string) => {
    const users = JSON.parse(localStorage.getItem('bepawa_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === pharmacyId ? { ...u, isApproved: true } : u
    );
    localStorage.setItem('bepawa_users', JSON.stringify(updatedUsers));
    
    // Refresh data
    setPendingPharmacies(prev => prev.filter((p: any) => p.id !== pharmacyId));
    setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const updatedOrders = orders.map((o: any) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem('bepawa_orders', JSON.stringify(updatedOrders));
    
    // Refresh orders
    setRecentOrders(updatedOrders.slice(0, 10));
  };

  if (!user || user.role !== 'admin') {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'packed': return 'bg-blue-500';
      case 'out-for-delivery': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your pharmaceutical distribution business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pharmacies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPharmacies}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
            <TabsTrigger value="pharmacies">Pharmacy Approvals</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">Pharmacy: {order.pharmacyName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium">KSh {order.total.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="packed">Packed</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pharmacies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Pharmacy Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPharmacies.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No pending approvals</p>
                  ) : (
                    pendingPharmacies.map((pharmacy: any) => (
                      <div key={pharmacy.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{pharmacy.pharmacyName}</p>
                          <p className="text-sm text-gray-600">Contact: {pharmacy.name}</p>
                          <p className="text-sm text-gray-600">Email: {pharmacy.email}</p>
                          <p className="text-sm text-gray-600">Address: {pharmacy.address}</p>
                        </div>
                        <Button onClick={() => approvePharmacy(pharmacy.id)}>
                          Approve
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Product management features coming soon</p>
                  <Button disabled>Add New Product</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
