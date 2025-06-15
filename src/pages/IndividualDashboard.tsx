import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useIndividualDashboard } from "@/hooks/useIndividualDashboard";
import IndividualStatsCards from "@/components/individual/IndividualStatsCards";
import IndividualQuickActions from "@/components/individual/IndividualQuickActions";
import NearbyPharmacies from "@/components/individual/NearbyPharmacies";
import HealthSummary from "@/components/individual/HealthSummary";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationSubscription } from "@/hooks/useNotifications";

const IndividualDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading, isError, stats, recentOrders } = useIndividualDashboard();
  const [nearbyPharmacies, setNearbyPharmacies] = useState<any[]>([]);

  // Enable notification subscription for individuals
  useNotificationSubscription();

  useEffect(() => {
    if (!user || user.role !== 'individual') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchNearbyPharmacies() {
      // Fetch pharmacies from profiles table (role=retail)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, business_name, region, city, is_approved')
        .eq('role', 'retail')
        .eq('is_approved', true)
        .limit(10);

      if (!error && Array.isArray(data)) {
        setNearbyPharmacies(
          data.map((p: any) => ({
            id: p.id,
            name: p.business_name,
            distance: "N/A",
            rating: 0,
            open: true,
          }))
        );
      }
    }
    fetchNearbyPharmacies();
  }, []);

  if (!user || user.role !== 'individual' || isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

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
        <IndividualStatsCards stats={stats} />
        <IndividualQuickActions />
        <div className="grid lg:grid-cols-2 gap-8">
          <NearbyPharmacies pharmacies={nearbyPharmacies} />
          <HealthSummary totalOrders={stats.totalOrders} recentOrders={recentOrders} />
        </div>
      </div>
    </div>
  );
};
export default IndividualDashboard;
