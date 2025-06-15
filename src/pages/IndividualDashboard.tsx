
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useIndividualDashboard } from "@/hooks/useIndividualDashboard";
import IndividualStatsCards from "@/components/individual/IndividualStatsCards";
import IndividualQuickActions from "@/components/individual/IndividualQuickActions";
import NearbyPharmacies from "@/components/individual/NearbyPharmacies";
import HealthSummary from "@/components/individual/HealthSummary";

const IndividualDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading, isError, stats, recentOrders } = useIndividualDashboard();

  useEffect(() => {
    if (!user || user.role !== 'individual') {
      navigate('/login');
    }
  }, [user, navigate]);

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

  // Example mock for nearby pharmacies, can be replaced with Supabase in the future
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
