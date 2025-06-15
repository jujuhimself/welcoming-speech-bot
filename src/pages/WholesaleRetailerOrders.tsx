
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  Search, 
  Eye, 
  Package,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'partial';
}

interface Pharmacy {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

const WholesaleRetailerOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    async function fetchRetailersAndOrders() {
      setLoading(true);

      // 1. Fetch retailer profiles (retail pharmacies) who have ever placed an order with this wholesaler
      // 2. For each, gather their orders & items

      // Get distinct pharmacy_ids from orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, created_at, total_amount, status, payment_status, pharmacy_id')
        .eq('wholesaler_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        setPharmacies([]);
        setLoading(false);
        return;
      }

      // Collect all unique pharmacy_ids
      const pharmacyIds = Array.from(new Set((orders ?? []).map((o: any) => o.pharmacy_id).filter(Boolean)));
      let pharmacyProfiles: any[] = [];
      if (pharmacyIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, business_name, name, email, phone, address, region, city')
          .in('id', pharmacyIds);

        pharmacyProfiles = profileData || [];
      }

      // Map orders to pharmacies
      const pharmacyMap: Record<string, Pharmacy> = {};
      pharmacyProfiles.forEach(p => {
        pharmacyMap[p.id] = {
          id: p.id,
          name: p.business_name || p.name || "Retailer",
          contactPerson: p.name || "",
          email: p.email || "",
          phone: p.phone || "",
          location: [p.city, p.region, p.address].filter(Boolean).join(", "),
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: "",
          orders: []
        };
      });

      // Fetch all order items for these orders
      const orderIds = (orders || []).map(o => o.id);
      let itemsByOrderId: Record<string, OrderItem[]> = {};
      if (orderIds.length > 0) {
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('id, order_id, product_name, quantity, unit_price')
          .in('order_id', orderIds);

        (orderItems || []).forEach(item => {
          if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
          itemsByOrderId[item.order_id].push({
            id: item.id,
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            total: item.quantity * item.unit_price,
          });
        });
      }

      // Organize order list per pharmacy
      (orders || []).forEach(order => {
        if (!order.pharmacy_id || !pharmacyMap[order.pharmacy_id]) return;
        const orderObj: Order = {
          id: order.id,
          orderNumber: order.order_number,
          date: order.created_at,
          items: itemsByOrderId[order.id] || [],
          total: Number(order.total_amount),
          status: order.status,
          paymentStatus: order.payment_status || "pending"
        };
        pharmacyMap[order.pharmacy_id].orders.push(orderObj);
      });

      // Calculate stats
      Object.values(pharmacyMap).forEach(pharmacy => {
        pharmacy.totalOrders = pharmacy.orders.length;
        pharmacy.totalSpent = pharmacy.orders.reduce((sum, o) => sum + o.total, 0);
        pharmacy.lastOrderDate = pharmacy.orders.length ? pharmacy.orders[0].date : "";
      });

      setPharmacies(Object.values(pharmacyMap));
      setLoading(false);
    }
    fetchRetailersAndOrders();
  }, [user, navigate]);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pharmacy.contactPerson && pharmacy.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Retailer Orders</h1>
          <p className="text-gray-600 text-lg">Manage orders from your retail pharmacy partners</p>
        </div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search pharmacies by name or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pharmacy List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Pharmacy Partners ({filteredPharmacies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {loading ? (
                    <div>Loading...</div>
                  ) : filteredPharmacies.length === 0 ? (
                    <div className="text-gray-600">No pharmacies found.</div>
                  ) : filteredPharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPharmacy?.id === pharmacy.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{pharmacy.name}</h3>
                        <Badge variant="outline">{pharmacy.totalOrders} orders</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{pharmacy.contactPerson}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        {pharmacy.location}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 font-medium">
                          TZS {(pharmacy.totalSpent / 1000000).toFixed(1)}M
                        </span>
                        <span className="text-gray-500">
                          Last: {pharmacy.lastOrderDate ? new Date(pharmacy.lastOrderDate).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedPharmacy ? (
              <div className="space-y-6">
                {/* Pharmacy Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {selectedPharmacy.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedPharmacy.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedPharmacy.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{selectedPharmacy.location}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{selectedPharmacy.totalOrders}</div>
                          <div className="text-xs text-gray-500">Total Orders</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            TZS {(selectedPharmacy.totalSpent / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500">Total Spent</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Order History ({selectedPharmacy.orders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPharmacy.orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">{order.orderNumber}</h4>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {new Date(order.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                TZS {order.total.toLocaleString()}
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">Order Items:</h5>
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                <span>{item.productName}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>TZS {item.total.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Package className="h-4 w-4 mr-1" />
                              Process Order
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Pharmacy</h3>
                  <p className="text-gray-500">Choose a pharmacy from the list to view their order details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleRetailerOrders;
