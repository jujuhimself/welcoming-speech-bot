// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, DollarSign, Users, TrendingUp, FileText, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BackupScheduleManager from "@/components/BackupScheduleManager";
import { supabase } from "@/integrations/supabase/client";

// Add the missing Button import here
import { Button } from "@/components/ui/button";

// Define type for orders
type WholesaleOrder = {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  pharmacy_id?: string;
  pharmacy_name?: string;
};

// Type for retail profile
type RetailerProfile = {
  id: string;
  name: string;
  business_name: string;
};

// Import new components
import WholesaleStatsCards from "@/components/wholesale/WholesaleStatsCards";
import WholesaleQuickActions from "@/components/wholesale/WholesaleQuickActions";
import WholesaleRecentOrders from "@/components/wholesale/WholesaleRecentOrders";
import WholesalePendingApprovalNotice from "@/components/wholesale/WholesalePendingApprovalNotice";

const WholesaleDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeRetailers: 0,
    lowStockItems: 0
  });

  // Helper: load orders, stats, retailers
  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    if (!user.isApproved) {
      return;
    }

    // Fetch orders from Supabase by wholesaler_id
    async function fetchWholesaleData() {
      // 1. Orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, order_number, created_at, total_amount, status, pharmacy_id')
        .eq('wholesaler_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (orderError) {
        setOrders([]); // fallback
        return;
      }

      // Fetch pharmacy names for display (batch query)
      const pharmacyIds = orderData?.map((o: any) => o.pharmacy_id).filter(Boolean);
      let pharmacies: Record<string, string> = {};
      if (pharmacyIds && pharmacyIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, business_name, name')
          .in('id', pharmacyIds);

        profileData?.forEach((profile: any) => {
          pharmacies[profile.id] = profile.business_name || profile.name;
        });
      }

      const enhancedOrders = (orderData || []).map((order: any) => ({
        ...order,
        pharmacy_name: pharmacies[order.pharmacy_id] || ""
      }));

      setOrders(enhancedOrders);

      // 2. Stats - aggregate from all orders for this wholesaler
      const { data: allOrders } = await supabase
        .from('orders')
        .select('id, total_amount, pharmacy_id')
        .eq('wholesaler_id', user.id);

      const totalRevenue = (allOrders || []).reduce((sum: number, ord: any) => sum + Number(ord.total_amount || 0), 0);
      const totalOrders = (allOrders || []).length || 0;
      const activeRetailers = new Set((allOrders || []).map((o: any) => o.pharmacy_id)).size;

      // Count low stock items (mock, or fetch products if you want)
      let lowStockItems = 0;
      const { data: productData } = await supabase
        .from('products')
        .select('id, stock, min_stock')
        .eq('wholesaler_id', user.id);

      if (productData) {
        lowStockItems = productData.filter((prod: any) => Number(prod.stock) <= Number(prod.min_stock)).length;
      }

      setStats({
        totalRevenue,
        totalOrders,
        activeRetailers,
        lowStockItems
      });
    }

    fetchWholesaleData();
  }, [user, navigate]);

  if (!user || user.role !== 'wholesale') {
    return <div>Loading...</div>;
  }

  if (!user.isApproved) {
    return <WholesalePendingApprovalNotice logout={logout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Add demo link for the new features */}
        <div className="flex justify-end mb-4">
          <Button asChild variant="outline">
            <Link to="/wholesale-business-tools">
              CRM & Business Tools (New)
            </Link>
          </Button>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.businessName}
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your wholesale business and serve retail pharmacies
          </p>
        </div>
        <BackupScheduleManager />
        <WholesaleStatsCards stats={stats} />
        <WholesaleQuickActions />
        <WholesaleRecentOrders orders={orders} />
      </div>
    </div>
  );
};

export default WholesaleDashboard;
