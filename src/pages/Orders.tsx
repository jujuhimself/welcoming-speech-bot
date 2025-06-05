
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

interface Order {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'retail') {
      navigate('/login');
      return;
    }

    const allOrders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const userOrders = allOrders.filter((order: Order) => order.pharmacyId === user.id);
    setOrders(userOrders.reverse()); // Show newest first
  }, [user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'packed': return 'bg-blue-500';
      case 'out-for-delivery': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order is being processed';
      case 'packed': return 'Your order has been packed and ready for dispatch';
      case 'out-for-delivery': return 'Your order is on the way';
      case 'delivered': return 'Your order has been delivered';
      default: return 'Unknown status';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">Track your orders and delivery status</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => navigate('/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {getStatusDescription(order.status)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-2">Items Ordered:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span>{item.name}</span>
                            <span className="text-sm text-gray-600">
                              {item.quantity} × KSh {item.price.toLocaleString()} = KSh {(item.quantity * item.price).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">Total: KSh {order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Progress */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Delivery Progress:</h4>
                      <div className="flex items-center space-x-4">
                        {['pending', 'packed', 'out-for-delivery', 'delivered'].map((status, index) => (
                          <div key={status} className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${
                              ['pending', 'packed', 'out-for-delivery', 'delivered'].indexOf(order.status) >= index
                                ? 'bg-blue-600' 
                                : 'bg-gray-300'
                            }`} />
                            <span className="ml-2 text-sm capitalize">
                              {status.replace('-', ' ')}
                            </span>
                            {index < 3 && <div className={`w-8 h-0.5 ml-4 ${
                              ['pending', 'packed', 'out-for-delivery', 'delivered'].indexOf(order.status) > index
                                ? 'bg-blue-600' 
                                : 'bg-gray-300'
                            }`} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
