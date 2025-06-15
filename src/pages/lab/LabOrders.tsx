
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TestTube, Search, Calendar, User, Clock, Filter, Eye, Download } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LabOrder {
  id: string;
  patient_name: string;
  patient_phone?: string;
  patient_age?: number;
  patient_gender?: string;
  doctor_name: string;
  doctor_phone?: string;
  order_date: string;
  sample_collection_date?: string;
  sample_collection_time?: string;
  total_amount: number;
  status: 'pending' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  special_instructions?: string;
  lab_order_items?: any[];
}

const LabOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchLabOrders();
    }
  }, [user]);

  const fetchLabOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_orders')
        .select(`
          *,
          lab_order_items (*)
        `)
        .eq('lab_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching lab orders:', error);
      toast({
        title: "Error",
        description: "Failed to load lab orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sample_collected': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div>Loading lab orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Lab Orders"
          description="Manage and track all laboratory orders"
          badge={{ text: "Lab Portal", variant: "outline" }}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by patient name, doctor, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === 'processing' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('processing')}
            >
              Processing
            </Button>
            <Button 
              variant={statusFilter === 'completed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lab orders found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? "No orders match your current search or filter."
                  : "No lab orders have been received yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Order #{order.id.slice(0, 8)}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{order.patient_name}</span>
                          {order.patient_age && <span className="ml-1">({order.patient_age}y)</span>}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Doctor</p>
                      <p className="text-sm text-gray-600">{order.doctor_name}</p>
                      {order.doctor_phone && (
                        <p className="text-sm text-gray-500">{order.doctor_phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Amount</p>
                      <p className="text-sm text-gray-600">TZS {order.total_amount.toLocaleString()}</p>
                    </div>
                  </div>

                  {order.sample_collection_date && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Sample Collection</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        {new Date(order.sample_collection_date).toLocaleDateString()}
                        {order.sample_collection_time && ` at ${order.sample_collection_time}`}
                      </p>
                    </div>
                  )}

                  {order.special_instructions && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions</p>
                      <p className="text-sm text-gray-600">{order.special_instructions}</p>
                    </div>
                  )}

                  {order.lab_order_items && order.lab_order_items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Tests Ordered</p>
                      <div className="space-y-1">
                        {order.lab_order_items.slice(0, 3).map((item: any, index: number) => (
                          <p key={index} className="text-sm text-gray-600">• {item.test_name}</p>
                        ))}
                        {order.lab_order_items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.lab_order_items.length - 3} more tests
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {order.status === 'pending' && (
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    )}
                    {order.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download Results
                      </Button>
                    )}
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

export default LabOrders;
