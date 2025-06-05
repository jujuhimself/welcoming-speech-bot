
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Package, FileText, Eye, Check, X, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

interface Order {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  expectedDelivery?: string;
}

const WholesaleOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Load wholesale orders
    const allOrders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const wholesaleOrders = allOrders.filter((order: any) => order.wholesalerId === user.id);
    
    if (wholesaleOrders.length === 0) {
      // Initialize with sample orders
      const sampleOrders: Order[] = [
        {
          id: 'WO-001',
          pharmacyId: '3',
          pharmacyName: 'City Pharmacy',
          items: [
            { id: '1', name: 'Paracetamol 500mg', quantity: 100, price: 25000 },
            { id: '2', name: 'Amoxicillin 250mg', quantity: 50, price: 45000 }
          ],
          total: 4750000,
          status: 'pending',
          createdAt: new Date().toISOString(),
          expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'WO-002',
          pharmacyId: '4',
          pharmacyName: 'Health Plus Pharmacy',
          items: [
            { id: '3', name: 'Insulin Injection', quantity: 20, price: 120000 }
          ],
          total: 2400000,
          status: 'processing',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setOrders(sampleOrders);
    } else {
      setOrders(wholesaleOrders);
    }
  }, [user, navigate]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    // Update localStorage
    const allOrders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const updatedAllOrders = allOrders.map((order: any) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('bepawa_orders', JSON.stringify(updatedAllOrders));
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delivered': return <Check className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600 text-lg">Manage B2B orders from retail pharmacies</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.all}</div>
              <div className="text-xs text-blue-100">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.pending}</div>
              <div className="text-xs text-yellow-100">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.processing}</div>
              <div className="text-xs text-blue-100">Processing</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.shipped}</div>
              <div className="text-xs text-purple-100">Shipped</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.delivered}</div>
              <div className="text-xs text-green-100">Delivered</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{statusCounts.cancelled}</div>
              <div className="text-xs text-red-100">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  onClick={() => setSelectedStatus(status)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All Orders' : status} ({count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">B2B Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-xl p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                          <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">From: {order.pharmacyName}</p>
                        <p className="text-sm text-gray-500">
                          Ordered: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.expectedDelivery && (
                          <p className="text-sm text-gray-500">
                            Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">TZS {order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-medium mb-2">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                            <span>{item.name}</span>
                            <span className="font-medium">
                              {item.quantity} × TZS {item.price.toLocaleString()} = TZS {(item.quantity * item.price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      
                      {order.status === 'pending' && (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept Order
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'processing' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Mark as Shipped
                        </Button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <Button 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WholesaleOrders;
