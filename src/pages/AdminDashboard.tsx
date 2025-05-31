
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Users, ShoppingCart, Clock, BarChart3, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AdminAnalytics from "@/components/AdminAnalytics";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalPharmacies: 0,
    pendingApprovals: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pendingCreditRequests: 0
  });
  const [pendingPharmacies, setPendingPharmacies] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Load admin stats
    const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const users = JSON.parse(localStorage.getItem('bepawa_users') || '[]');
    const products = JSON.parse(localStorage.getItem('bepawa_products') || '[]');
    const creditReqs = JSON.parse(localStorage.getItem('bepawa_credit_requests') || '[]');
    
    const pharmacies = users.filter((u: any) => u.role === 'pharmacy');
    const pending = pharmacies.filter((p: any) => !p.isApproved);
    const lowStock = products.filter((p: any) => p.stock < 10);
    const pendingCredit = creditReqs.filter((req: any) => req.status === 'pending');

    setStats({
      totalOrders: orders.length,
      pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
      totalPharmacies: pharmacies.length,
      pendingApprovals: pending.length,
      totalProducts: products.length,
      lowStockProducts: lowStock.length,
      pendingCreditRequests: pendingCredit.length
    });

    setPendingPharmacies(pending);
    setRecentOrders(orders.slice(0, 10));
    setCreditRequests(pendingCredit);
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
    
    toast({
      title: "Pharmacy approved",
      description: "The pharmacy has been successfully approved and can now place orders.",
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const updatedOrders = orders.map((o: any) => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem('bepawa_orders', JSON.stringify(updatedOrders));
    
    // Refresh orders
    setRecentOrders(updatedOrders.slice(0, 10));
    
    toast({
      title: "Order status updated",
      description: `Order #${orderId} status changed to ${newStatus.replace('-', ' ')}`,
    });
  };

  const approveCreditRequest = (requestId: string) => {
    const requests = JSON.parse(localStorage.getItem('bepawa_credit_requests') || '[]');
    const updatedRequests = requests.map((req: any) => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    );
    localStorage.setItem('bepawa_credit_requests', JSON.stringify(updatedRequests));
    
    setCreditRequests(prev => prev.filter((req: any) => req.id !== requestId));
    setStats(prev => ({ ...prev, pendingCreditRequests: prev.pendingCreditRequests - 1 }));
    
    toast({
      title: "Credit request approved",
      description: "The credit request has been approved.",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your pharmaceutical distribution business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-blue-100">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-yellow-100">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-green-100">Pharmacies</CardTitle>
              <Users className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPharmacies}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-purple-100">Approvals</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-indigo-100">Products</CardTitle>
              <Package className="h-4 w-4 text-indigo-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-red-100">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-red-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-orange-100">Credit Req</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCreditRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">Orders</TabsTrigger>
            <TabsTrigger value="pharmacies" className="text-sm">Pharmacies</TabsTrigger>
            <TabsTrigger value="products" className="text-sm">Products</TabsTrigger>
            <TabsTrigger value="credit" className="text-sm">Credit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="mt-6">
            <AdminAnalytics />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4 mt-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                    <div key={order.id} className="flex justify-between items-center p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-semibold text-lg">Order #{order.id}</p>
                        <p className="text-gray-600">Pharmacy: {order.pharmacyName}</p>
                        <p className="text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="font-bold text-blue-600">TZS {order.total.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1`}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Select 
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="packed">Packed</SelectItem>
                            <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pharmacies" className="space-y-4 mt-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Pending Pharmacy Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPharmacies.length === 0 ? (
                    <p className="text-gray-600 text-center py-8 text-lg">No pending approvals</p>
                  ) : (
                    pendingPharmacies.map((pharmacy: any) => (
                      <div key={pharmacy.id} className="flex justify-between items-center p-6 border rounded-xl bg-gray-50">
                        <div>
                          <p className="font-semibold text-lg">{pharmacy.pharmacyName}</p>
                          <p className="text-gray-600">Contact: {pharmacy.name}</p>
                          <p className="text-gray-600">Email: {pharmacy.email}</p>
                          <p className="text-gray-600">Address: {pharmacy.address}</p>
                        </div>
                        <Button onClick={() => approvePharmacy(pharmacy.id)} size="lg">
                          Approve
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4 mt-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <p className="text-gray-600 mb-6 text-lg">Product management features coming soon</p>
                  <Button disabled size="lg">Add New Product</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit" className="space-y-4 mt-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Credit Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditRequests.length === 0 ? (
                    <p className="text-gray-600 text-center py-8 text-lg">No pending credit requests</p>
                  ) : (
                    creditRequests.map((request: any) => (
                      <div key={request.id} className="flex justify-between items-center p-6 border rounded-xl bg-gray-50">
                        <div>
                          <p className="font-semibold text-lg">{request.pharmacyName}</p>
                          <p className="text-gray-600">Amount: TZS {request.amount.toLocaleString()}</p>
                          <p className="text-gray-600">Period: {request.repaymentPeriod}</p>
                          <p className="text-gray-600">Reason: {request.reason}</p>
                          <p className="text-gray-600 text-sm mt-2">{request.businessJustification}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => approveCreditRequest(request.id)} size="lg">
                            Approve
                          </Button>
                          <Button variant="outline" size="lg">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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
