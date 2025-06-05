
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, FileText, Clock, Heart, ShoppingCart, Upload, Stethoscope } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const IndividualDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    savedItems: 0,
    activePrescriptions: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'individual') {
      navigate('/login');
      return;
    }

    // Load individual stats
    const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
    const userOrders = orders.filter((order: any) => order.userId === user.id);
    const savedItems = JSON.parse(localStorage.getItem(`bepawa_wishlist_${user.id}`) || '[]');
    const prescriptions = JSON.parse(localStorage.getItem(`bepawa_prescriptions_${user.id}`) || '[]');
    const activePrescriptions = prescriptions.filter((p: any) => p.status === 'pending' || p.status === 'processed');
    
    setRecentOrders(userOrders.slice(0, 5));
    setStats({
      totalOrders: userOrders.length,
      pendingOrders: userOrders.filter((order: any) => order.status === 'pending').length,
      savedItems: savedItems.length,
      activePrescriptions: activePrescriptions.length
    });
  }, [user, navigate]);

  if (!user || user.role !== 'individual') {
    return <div>Loading...</div>;
  }

  const nearbyPharmacies = [
    { id: 1, name: "City Pharmacy", distance: "0.5 km", rating: 4.8, open: true },
    { id: 2, name: "HealthCare Plus", distance: "1.2 km", rating: 4.6, open: true },
    { id: 3, name: "MediPoint", distance: "2.1 km", rating: 4.7, open: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 text-lg">Find nearby pharmacies and order your medicines</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">My Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-yellow-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Saved Items</CardTitle>
              <Heart className="h-4 w-4 text-red-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.savedItems}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activePrescriptions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-24 flex-col bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/products">
                  <Search className="h-8 w-8 mb-2" />
                  Browse Medicines
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/pharmacies">
                  <MapPin className="h-8 w-8 mb-2" />
                  Find Pharmacies
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/prescriptions">
                  <Upload className="h-8 w-8 mb-2" />
                  Upload Prescription
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/orders">
                  <Clock className="h-8 w-8 mb-2" />
                  Order History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Nearby Pharmacies */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Nearby Pharmacies</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/pharmacies">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyPharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-lg">{pharmacy.name}</p>
                      <p className="text-gray-600">{pharmacy.distance} away</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-yellow-500">★ {pharmacy.rating}</span>
                        <Badge variant={pharmacy.open ? "default" : "secondary"}>
                          {pharmacy.open ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Store
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders & Health Summary */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="space-y-6">
                  {/* No Orders Yet */}
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                    <Button asChild size="lg">
                      <Link to="/products">Start Shopping</Link>
                    </Button>
                  </div>
                  
                  {/* Health Tips */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Health Tips
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Keep a digital copy of your prescriptions</p>
                      <p>• Set medication reminders</p>
                      <p>• Check expiry dates regularly</p>
                      <p>• Consult with pharmacists for advice</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Orders</h3>
                  {recentOrders.map((order: any) => (
                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="font-bold text-blue-600">KSh {order.total.toLocaleString()}</p>
                      </div>
                      <Badge>{order.status}</Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/orders">View All Orders</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboard;
