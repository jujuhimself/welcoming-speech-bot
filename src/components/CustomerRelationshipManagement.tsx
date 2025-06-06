
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, Phone, Mail, MessageCircle, Calendar, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  notes: string;
  status: 'active' | 'inactive';
}

interface Communication {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'sms' | 'meeting';
  subject: string;
  notes: string;
  date: string;
}

const CustomerRelationshipManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCommunication, setNewCommunication] = useState({
    type: 'call' as 'call' | 'email' | 'sms' | 'meeting',
    subject: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load sample customer data
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'Dr. John Mwangi',
        email: 'john.mwangi@hospital.co.tz',
        phone: '+255123456789',
        address: 'Dar es Salaam Medical Center',
        totalOrders: 45,
        totalSpent: 12500000,
        lastOrderDate: '2024-06-05',
        notes: 'Regular customer, prefers bulk orders',
        status: 'active'
      },
      {
        id: '2',
        name: 'Grace Pharmacy',
        email: 'orders@gracepharmacy.tz',
        phone: '+255987654321',
        address: 'Arusha, Tanzania',
        totalOrders: 28,
        totalSpent: 8750000,
        lastOrderDate: '2024-06-03',
        notes: 'Fast-growing pharmacy chain',
        status: 'active'
      },
      {
        id: '3',
        name: 'Central Hospital',
        email: 'procurement@centralhospital.tz',
        phone: '+255555666777',
        address: 'Dodoma, Tanzania',
        totalOrders: 62,
        totalSpent: 18900000,
        lastOrderDate: '2024-06-01',
        notes: 'Large volume orders, payment terms negotiated',
        status: 'active'
      }
    ];

    const sampleCommunications: Communication[] = [
      {
        id: '1',
        customerId: '1',
        type: 'call',
        subject: 'Monthly order discussion',
        notes: 'Discussed upcoming bulk order for antibiotics',
        date: '2024-06-04'
      },
      {
        id: '2',
        customerId: '2',
        type: 'email',
        subject: 'New product catalog',
        notes: 'Sent updated catalog with new medicines',
        date: '2024-06-02'
      }
    ];

    setCustomers(sampleCustomers);
    setCommunications(sampleCommunications);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const addCommunication = () => {
    if (!selectedCustomer || !newCommunication.subject) return;

    const communication: Communication = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      ...newCommunication,
      date: new Date().toISOString().split('T')[0]
    };

    setCommunications(prev => [...prev, communication]);
    setNewCommunication({ type: 'call', subject: '', notes: '' });
    
    toast({
      title: "Communication Logged",
      description: "Customer interaction has been recorded successfully.",
    });
  };

  const customerCommunications = communications.filter(c => c.customerId === selectedCustomer?.id);

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageCircle className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Customer List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers ({customers.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                    selectedCustomer?.id === customer.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.phone}</p>
                    </div>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {customer.totalOrders} orders • TZS {customer.totalSpent.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details and Communications */}
      <div className="lg:col-span-2 space-y-6">
        {selectedCustomer ? (
          <>
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedCustomer.name}</h3>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <p className="text-gray-600">{selectedCustomer.address}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                        <div className="text-sm text-gray-600">Total Orders</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          TZS {selectedCustomer.totalSpent.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Spent</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Last Order: {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {selectedCustomer.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium">Notes:</h4>
                    <p className="text-sm text-gray-600">{selectedCustomer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Communication History */}
            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Communication */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">Log New Communication</h4>
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <select
                        className="border rounded px-3 py-2"
                        value={newCommunication.type}
                        onChange={(e) => setNewCommunication(prev => ({ 
                          ...prev, 
                          type: e.target.value as 'call' | 'email' | 'sms' | 'meeting' 
                        }))}
                      >
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="meeting">Meeting</option>
                      </select>
                      <Input
                        placeholder="Subject"
                        value={newCommunication.subject}
                        onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                      />
                    </div>
                    <Textarea
                      placeholder="Notes"
                      value={newCommunication.notes}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, notes: e.target.value }))}
                      className="mb-3"
                    />
                    <Button onClick={addCommunication}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Log Communication
                    </Button>
                  </div>

                  {/* Communication List */}
                  <div className="space-y-3">
                    {customerCommunications.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No communications recorded yet</p>
                    ) : (
                      customerCommunications.reverse().map(comm => (
                        <div key={comm.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {getCommunicationIcon(comm.type)}
                            <span className="font-medium capitalize">{comm.type}</span>
                            <Badge variant="outline">{new Date(comm.date).toLocaleDateString()}</Badge>
                          </div>
                          <h4 className="font-medium">{comm.subject}</h4>
                          {comm.notes && <p className="text-sm text-gray-600 mt-1">{comm.notes}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Customer</h3>
              <p className="text-gray-500">Choose a customer from the list to view details and communication history</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerRelationshipManagement;
