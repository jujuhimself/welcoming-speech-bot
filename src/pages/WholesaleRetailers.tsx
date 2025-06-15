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
  Phone, 
  Mail,
  MapPin,
  TrendingUp,
  DollarSign,
  Package,
  Plus,
  Eye,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Retailer {
  id: string;
  pharmacyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: string;
  lastOrder: string;
  totalOrders: number;
  totalSpent: number;
  creditLimit: number;
  creditUsed: number;
  paymentTerm: string;
}

const WholesaleRetailers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Sample retailers data
    const sampleRetailers: Retailer[] = [
      {
        id: '1',
        pharmacyName: 'City Pharmacy',
        contactPerson: 'John Mwangi',
        email: 'john@citypharmacy.co.tz',
        phone: '+255 712 345 678',
        location: 'Kinondoni, Dar es Salaam',
        region: 'Dar es Salaam',
        status: 'active',
        registrationDate: '2024-01-15',
        lastOrder: '2024-06-05',
        totalOrders: 45,
        totalSpent: 12450000,
        creditLimit: 5000000,
        creditUsed: 1200000,
        paymentTerm: '30 days'
      },
      {
        id: '2',
        pharmacyName: 'HealthCare Plus',
        contactPerson: 'Sarah Hassan',
        email: 'sarah@healthcareplus.co.tz',
        phone: '+255 754 987 654',
        location: 'Central, Arusha',
        region: 'Arusha',
        status: 'active',
        registrationDate: '2024-02-20',
        lastOrder: '2024-06-04',
        totalOrders: 32,
        totalSpent: 8750000,
        creditLimit: 3000000,
        creditUsed: 750000,
        paymentTerm: '15 days'
      },
      {
        id: '3',
        pharmacyName: 'MediPoint',
        contactPerson: 'David Kimani',
        email: 'david@medipoint.co.tz',
        phone: '+255 687 543 210',
        location: 'Nyamagana, Mwanza',
        region: 'Mwanza',
        status: 'inactive',
        registrationDate: '2024-03-10',
        lastOrder: '2024-04-22',
        totalOrders: 18,
        totalSpent: 3200000,
        creditLimit: 2000000,
        creditUsed: 0,
        paymentTerm: '30 days'
      },
      {
        id: '4',
        pharmacyName: 'PharmaCare',
        contactPerson: 'Grace Mlaki',
        email: 'grace@pharmacare.co.tz',
        phone: '+255 765 432 109',
        location: 'Central, Dodoma',
        region: 'Dodoma',
        status: 'active',
        registrationDate: '2024-04-05',
        lastOrder: '2024-06-06',
        totalOrders: 28,
        totalSpent: 6800000,
        creditLimit: 4000000,
        creditUsed: 1800000,
        paymentTerm: '21 days'
      },
      {
        id: '5',
        pharmacyName: 'WellnessMed',
        contactPerson: 'Peter Mushi',
        email: 'peter@wellnessmed.co.tz',
        phone: '+255 678 901 234',
        location: 'Urban, Mbeya',
        region: 'Mbeya',
        status: 'pending',
        registrationDate: '2024-06-01',
        lastOrder: 'Never',
        totalOrders: 0,
        totalSpent: 0,
        creditLimit: 1000000,
        creditUsed: 0,
        paymentTerm: '30 days'
      },
      {
        id: '4',
        pharmacyName: 'Mbeya Meds',
        contactPerson: 'Asha Juma',
        email: 'asha@mbeyameds.co.tz',
        phone: '+255 788 123 456',
        location: 'Forest Area, Mbeya',
        region: 'Mbeya',
        status: 'pending',
        registrationDate: '2024-05-01',
        lastOrder: 'N/A',
        totalOrders: 0,
        totalSpent: 0,
        creditLimit: 0,
        creditUsed: 0,
        paymentTerm: 'COD'
      }
    ];

    setRetailers(sampleRetailers);
  }, [user, navigate]);

  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = retailer.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retailer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || retailer.region === selectedRegion;
    const matchesTab = activeTab === "all" || retailer.status === activeTab;
    
    return matchesSearch && matchesRegion && matchesTab;
  });

  const regions = ["all", ...Array.from(new Set(retailers.map(r => r.region)))];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = (retailerId: string) => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the retailer.",
    });
  };

  const handleUpdateStatus = (retailerId: string, newStatus: string) => {
    setRetailers(prev => prev.map(retailer => 
      retailer.id === retailerId ? { ...retailer, status: newStatus as any } : retailer
    ));
    
    toast({
      title: "Status Updated",
      description: `Retailer status changed to ${newStatus}`,
    });
  };

  const stats = {
    totalRetailers: retailers.length,
    activeRetailers: retailers.filter(r => r.status === 'active').length,
    pendingApprovals: retailers.filter(r => r.status === 'pending').length,
    totalRevenue: retailers.reduce((sum, r) => sum + r.totalSpent, 0),
    totalCreditUsed: retailers.reduce((sum, r) => sum + r.creditUsed, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Retailer Management</h1>
            <p className="text-gray-600 text-lg">Manage your pharmacy retailer network</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Add Retailer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Retailers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalRetailers}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeRetailers}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">TZS {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Credit Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">TZS {(stats.totalCreditUsed / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search retailers by name or contact person..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region === 'all' ? 'All Regions' : region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retailers Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Retailers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredRetailers.map((retailer) => (
                <Card key={retailer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{retailer.pharmacyName}</h3>
                          <p className="text-gray-600">{retailer.contactPerson}</p>
                          <Badge className={getStatusColor(retailer.status)}>
                            {retailer.status.charAt(0).toUpperCase() + retailer.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{retailer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{retailer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{retailer.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{retailer.totalOrders}</div>
                        <div className="text-xs text-gray-500">Total Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          TZS {(retailer.totalSpent / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-gray-500">Total Spent</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Credit Used</span>
                        <span>TZS {retailer.creditUsed.toLocaleString()} / {retailer.creditLimit.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(retailer.creditUsed / retailer.creditLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSendMessage(retailer.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      {retailer.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(retailer.id, 'active')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      )}
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

export default WholesaleRetailers;
