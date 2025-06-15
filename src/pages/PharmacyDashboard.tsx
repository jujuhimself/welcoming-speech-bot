
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import QuickReorder from "@/components/QuickReorder";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { NotificationService } from "@/components/NotificationSystem";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationSubscription } from "@/hooks/useNotifications";
import PharmacyStatsCards from "@/components/pharmacy/PharmacyStatsCards";
import PharmacyQuickActions from "@/components/pharmacy/PharmacyQuickActions";
import PharmacyAdditionalServices from "@/components/pharmacy/PharmacyAdditionalServices";
import PharmacyRecentOrders from "@/components/pharmacy/PharmacyRecentOrders";

const PharmacyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    cartItems: 0
  });

  // Ensure real-time notifications are enabled for pharmacy users
  useNotificationSubscription();

  useEffect(() => {
    if (!user || user.role !== 'retail') {
      navigate('/login');
      return;
    }

    if (!user.isApproved) {
      // Show pending approval message
      return;
    }

    // Fetch stats and recent orders from Supabase
    async function fetchOrdersAndStats() {
      // Fetch orders for current pharmacy
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('pharmacy_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        setRecentOrders([]);
        setStats((prev) => ({ ...prev, totalOrders: 0, pendingOrders: 0 }));
        return;
      }

      // For cart, still use localStorage (unless we refactor persistence for cart!)
      const cart = JSON.parse(localStorage.getItem(`bepawa_cart_${user.id}`) || '[]');

      setRecentOrders((orders || []).slice(0, 5));
      setStats({
        totalOrders: orders?.length || 0,
        pendingOrders: (orders || []).filter((o: any) => o.status === 'pending').length,
        cartItems: cart.length
      });

      // Add welcome notification
      NotificationService.addSystemNotification(`Welcome back, ${user.pharmacyName}! Your dashboard has been updated.`);
    }

    fetchOrdersAndStats();
  }, [user, navigate]);

  if (!user || user.role !== 'retail') {
    return <div>Loading...</div>;
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
            <p className="text-gray-600">
              Your pharmacy account is pending admin approval. You'll receive an email notification once approved.
            </p>
            <Button onClick={logout} variant="outline">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.pharmacyName}
          </h1>
          <p className="text-gray-600 text-lg">Manage your orders and browse our medical product catalog</p>
        </div>

        <PharmacyStatsCards stats={stats} />
        <QuickReorder />

        {/* Analytics Dashboard */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Business Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsDashboard />
          </CardContent>
        </Card>

        <PharmacyQuickActions cartItems={stats.cartItems} />
        <PharmacyAdditionalServices />
        <PharmacyRecentOrders recentOrders={recentOrders} />
      </div>
    </div>
  );
};

export default PharmacyDashboard;
