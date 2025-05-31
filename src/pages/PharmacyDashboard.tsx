
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingCart, Clock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import QuickReorder from "@/components/QuickReorder";

const PharmacyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    cartItems: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'pharmacy') {
      navigate('/login');
      return;
    }

    if (!user.isApproved) {
      // Show pending approval message
      return;
    }

    // Load pharmacy stats and recent orders
    const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const userOrders = orders.filter((order: any) => order.pharmacyId === user.id);
    const cart = JSON.parse(localStorage.getItem(`bepawa_cart_${user.id}`) || '[]');
    
    setRecentOrders(userOrders.slice(0, 5));
    setStats({
      totalOrders: userOrders.length,
      pendingOrders: userOrders.filter((order: any) => order.status === 'pending').length,
      cartItems: cart.length
    });
  }, [user, navigate]);

  if (!user || user.role !== 'pharmacy') {
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
            <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
            <p className="text-gray-600">
              Your pharmacy account is pending admin approval. You'll receive an email notification once approved.
            </p>
            <Button onClick={logout} variant="outline">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.pharmacyName}
          </h1>
          <p className="text-gray-600 text-lg">Manage your orders and browse our medical product catalog</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-yellow-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.cartItems}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reorder */}
        <QuickReorder />

        {/* Quick Actions */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-24 flex-col bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/products">
                  <Package className="h-8 w-8 mb-2" />
                  Browse Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/cart">
                  <ShoppingCart className="h-8 w-8 mb-2" />
                  View Cart ({stats.cartItems})
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/orders">
                  <Clock className="h-8 w-8 mb-2" />
                  Order History
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/credit-request">
                  <User className="h-8 w-8 mb-2" />
                  Request Credit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                <Button asChild size="lg">
                  <Link to="/products">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-lg">Order #{order.id}</p>
                      <p className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-blue-600">TZS {order.total.toLocaleString()}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1`}>
                      {order.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4" size="lg">
                  <Link to="/orders">View All Orders</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
