import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Package, TrendingUp, DollarSign, Users, BarChart3, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import BackupScheduleManager from "@/components/BackupScheduleManager";

const WholesaleDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeRetailers: 0,
    lowStockItems: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    if (!user.isApproved) {
      return;
    }

    // Load wholesale stats
    const allOrders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const wholesaleOrders = allOrders.filter((order: any) => order.wholesalerId === user.id);
    
    setOrders(wholesaleOrders.slice(0, 5));
    setStats({
      totalRevenue: wholesaleOrders.reduce((sum: number, order: any) => sum + order.total, 0),
      totalOrders: wholesaleOrders.length,
      activeRetailers: new Set(wholesaleOrders.map((order: any) => order.pharmacyId)).size,
      lowStockItems: 5 // Mock data
    });
  }, [user, navigate]);

  if (!user || user.role !== 'wholesale') {
    return <div>Loading...</div>;
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Package className="h-16 w-16 text-yellow-500 mx-auto" />
            <p className="text-gray-600">
              Your wholesale account is pending admin approval. You'll receive an email notification once approved.
            </p>
            <Button onClick={logout} variant="outline">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Add demo link for the new features */}
        <div className="flex justify-end mb-4">
          <Button asChild variant="outline">
            <Link to="/wholesale-business-tools">
              CRM & Business Tools (New)
            </Link>
          </Button>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.businessName}
          </h1>
          <p className="text-gray-600 text-lg">Manage your wholesale business and serve retail pharmacies</p>
        </div>
        {/* Backup Schedule section */}
        <BackupScheduleManager />
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TZS {stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Active Retailers</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeRetailers}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Low Stock Items</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.lowStockItems}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Business Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-24 flex-col bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/wholesale/inventory">
                  <Package className="h-8 w-8 mb-2" />
                  Inventory Management
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/wholesale/orders">
                  <FileText className="h-8 w-8 mb-2" />
                  Order Management
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/wholesale/analytics">
                  <BarChart3 className="h-8 w-8 mb-2" />
                  Business Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/wholesale/retailers">
                  <Users className="h-8 w-8 mb-2" />
                  Retailer Management
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Recent B2B Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                <Button asChild size="lg">
                  <Link to="/wholesale/catalog">Manage Product Catalog</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-lg">Order #{order.id}</p>
                      <p className="text-gray-600">From: {order.pharmacyName}</p>
                      <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="font-bold text-green-600">TZS {order.total.toLocaleString()}</p>
                    </div>
                    <Badge className="bg-blue-500 text-white">
                      {order.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4" size="lg">
                  <Link to="/wholesale/orders">View All Orders</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WholesaleDashboard;
