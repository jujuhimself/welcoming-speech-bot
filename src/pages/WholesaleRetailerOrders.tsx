
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Building, 
  Search, 
  Eye, 
  Package,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

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

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Sample data
    const samplePharmacies: Pharmacy[] = [
      {
        id: '1',
        name: 'City Pharmacy',
        contactPerson: 'John Mwangi',
        email: 'john@citypharmacy.co.tz',
        phone: '+255 712 345 678',
        location: 'Dar es Salaam, Kinondoni',
        totalOrders: 12,
        totalSpent: 4500000,
        lastOrderDate: '2024-06-06',
        orders: [
          {
            id: '1',
            orderNumber: 'WO-2024-001',
            date: '2024-06-06',
            items: [
              { id: '1', productName: 'Paracetamol 500mg', quantity: 100, unitPrice: 35, total: 3500 },
              { id: '2', productName: 'Amoxicillin 250mg', quantity: 50, unitPrice: 60, total: 3000 }
            ],
            total: 6500,
            status: 'pending',
            paymentStatus: 'pending'
          },
          {
            id: '2',
            orderNumber: 'WO-2024-007',
            date: '2024-06-03',
            items: [
              { id: '3', productName: 'Cough Syrup 200ml', quantity: 24, unitPrice: 40, total: 960 }
            ],
            total: 960,
            status: 'delivered',
            paymentStatus: 'paid'
          }
        ]
      },
      {
        id: '2',
        name: 'HealthCare Plus',
        contactPerson: 'Sarah Hassan',
        email: 'sarah@healthcareplus.co.tz',
        phone: '+255 754 987 654',
        location: 'Arusha, Central',
        totalOrders: 8,
        totalSpent: 2800000,
        lastOrderDate: '2024-06-05',
        orders: [
          {
            id: '3',
            orderNumber: 'WO-2024-002',
            date: '2024-06-05',
            items: [
              { id: '4', productName: 'Insulin Injection', quantity: 10, unitPrice: 150, total: 1500 },
              { id: '5', productName: 'Vitamin C 1000mg', quantity: 60, unitPrice: 25, total: 1500 }
            ],
            total: 3000,
            status: 'shipped',
            paymentStatus: 'paid'
          }
        ]
      }
    ];

    setPharmacies(samplePharmacies);
  }, [user, navigate]);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Search */}
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
                  {filteredPharmacies.map((pharmacy) => (
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
                          Last: {new Date(pharmacy.lastOrderDate).toLocaleDateString()}
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
