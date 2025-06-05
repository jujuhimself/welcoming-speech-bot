
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, Building, Phone, Mail, MapPin, TrendingUp, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

interface Retailer {
  id: string;
  pharmacyName: string;
  pharmacistName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive' | 'suspended';
}

const WholesaleRetailers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Load retail partners
    const allUsers = JSON.parse(localStorage.getItem('bepawa_users') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    
    const retailUsers = allUsers.filter((u: any) => u.role === 'retail' && u.isApproved);
    
    const retailersWithStats = retailUsers.map((retailer: any) => {
      const retailerOrders = allOrders.filter((order: any) => 
        order.pharmacyId === retailer.id && order.wholesalerId === user.id
      );
      
      return {
        id: retailer.id,
        pharmacyName: retailer.pharmacyName || 'Unknown Pharmacy',
        pharmacistName: retailer.pharmacistName || retailer.name,
        email: retailer.email,
        phone: retailer.phone || 'Not provided',
        address: retailer.address || 'Not provided',
        licenseNumber: retailer.licenseNumber || 'Not provided',
        joinedDate: retailer.createdAt || new Date().toISOString(),
        totalOrders: retailerOrders.length,
        totalSpent: retailerOrders.reduce((sum: number, order: any) => sum + order.total, 0),
        lastOrderDate: retailerOrders.length > 0 
          ? retailerOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
          : undefined,
        status: retailerOrders.length > 0 ? 'active' : 'inactive'
      };
    });

    setRetailers(retailersWithStats);
  }, [user, navigate]);

  const filteredRetailers = retailers.filter(retailer =>
    retailer.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retailer.pharmacistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retailer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalRetailers: retailers.length,
    activeRetailers: retailers.filter(r => r.status === 'active').length,
    totalRevenue: retailers.reduce((sum, r) => sum + r.totalSpent, 0),
    totalOrders: retailers.reduce((sum, r) => sum + r.totalOrders, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Retailer Management</h1>
          <p className="text-gray-600 text-lg">Manage your retail pharmacy partners</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-green-100">Active Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeRetailers}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TZS {stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search retailers by name, pharmacy, or email..."
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Retailers List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Retail Partners</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRetailers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No retailers found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRetailers.map((retailer) => (
                  <div key={retailer.id} className="border rounded-xl p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-3">
                          <Building className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{retailer.pharmacyName}</h3>
                          <p className="text-gray-600">Dr. {retailer.pharmacistName}</p>
                          <Badge className={`${getStatusColor(retailer.status)} text-white mt-1`}>
                            {retailer.status.charAt(0).toUpperCase() + retailer.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">TZS {retailer.totalSpent.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total spent</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div>
                        <h4 className="font-medium mb-3 text-gray-900">Contact Information</h4>
                        <div className="space-y-2">
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
                            <span>{retailer.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span>License: {retailer.licenseNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Business Stats */}
                      <div>
                        <h4 className="font-medium mb-3 text-gray-900">Business Statistics</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600">Total Orders</span>
                            </div>
                            <p className="text-xl font-semibold text-blue-900">{retailer.totalOrders}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Member Since</span>
                            </div>
                            <p className="text-sm font-semibold text-green-900">
                              {new Date(retailer.joinedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {retailer.lastOrderDate && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Last Order: </span>
                            <span className="text-sm font-medium">
                              {new Date(retailer.lastOrderDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-6 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Order History
                      </Button>
                      <Button variant="outline" size="sm">
                        Send Message
                      </Button>
                      <Button variant="outline" size="sm">
                        Credit Terms
                      </Button>
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

export default WholesaleRetailers;
