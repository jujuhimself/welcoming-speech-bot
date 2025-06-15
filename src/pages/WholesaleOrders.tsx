import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Search, 
  Eye, 
  Truck,
  Clock,
  CheckCircle,
  Filter,
  Download,
  MapPin
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  pharmacyName: string;
  pharmacyLocation: string;
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered';
  priority: 'normal' | 'urgent';
  orderDate: string;
  expectedDelivery: string;
  paymentStatus: 'pending' | 'paid' | 'partial';
}

const WholesaleOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Sample orders data
    const sampleOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'WO-2024-001',
        pharmacyName: 'City Pharmacy',
        pharmacyLocation: 'Dar es Salaam, Kinondoni',
        items: 15,
        total: 2450000,
        status: 'pending',
        priority: 'urgent',
        orderDate: '2024-06-06',
        expectedDelivery: '2024-06-08',
        paymentStatus: 'pending'
      },
      {
        id: '2',
        orderNumber: 'WO-2024-002',
        pharmacyName: 'HealthCare Plus',
        pharmacyLocation: 'Arusha, Central',
        items: 28,
        total: 4350000,
        status: 'confirmed',
        priority: 'normal',
        orderDate: '2024-06-05',
        expectedDelivery: '2024-06-09',
        paymentStatus: 'paid'
      },
      {
        id: '3',
        orderNumber: 'WO-2024-003',
        pharmacyName: 'MediPoint',
        pharmacyLocation: 'Mwanza, Nyamagana',
        items: 8,
        total: 1250000,
        status: 'packed',
        priority: 'normal',
        orderDate: '2024-06-04',
        expectedDelivery: '2024-06-07',
        paymentStatus: 'paid'
      },
      {
        id: '4',
        orderNumber: 'WO-2024-004',
        pharmacyName: 'PharmaCare',
        pharmacyLocation: 'Dodoma, Central',
        items: 35,
        total: 5680000,
        status: 'shipped',
        priority: 'normal',
        orderDate: '2024-06-03',
        expectedDelivery: '2024-06-06',
        paymentStatus: 'paid'
      },
      {
        id: '5',
        orderNumber: 'WO-2024-005',
        pharmacyName: 'WellnessMed',
        pharmacyLocation: 'Mbeya, Urban',
        items: 12,
        total: 1850000,
        status: 'delivered',
        priority: 'normal',
        orderDate: '2024-06-01',
        expectedDelivery: '2024-06-04',
        paymentStatus: 'paid'
      }
    ];

    setOrders(sampleOrders);
  }, [user, navigate]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
    });
  };

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'packed', 'shipped'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    urgentOrders: orders.filter(o => o.priority === 'urgent').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600 text-lg">Track and manage wholesale orders</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-5 w-5 mr-2" />
              Export Orders
            </Button>
            <Button variant="outline">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.delivered}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.urgentOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-indigo-100">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">TZS {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by order number or pharmacy name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="packed">Packed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                            {order.priority === 'urgent' && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-1">{order.pharmacyName}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {order.pharmacyLocation}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          TZS {order.total.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-500">{order.items} items</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                        <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Expected Delivery</p>
                        <p className="font-medium">{new Date(order.expectedDelivery).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Truck className="h-4 w-4 mr-1" />
                          Track Order
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'packed')}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Mark Packed
                          </Button>
                        )}
                        {order.status === 'packed' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Ship Order
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WholesaleOrders;
