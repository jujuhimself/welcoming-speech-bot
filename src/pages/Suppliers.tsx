
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import SupplierManagement from "@/components/inventory/SupplierManagement";

const SuppliersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'retail' && user.role !== 'wholesale')) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'retail' && user.role !== 'wholesale')) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Suppliers"
          description="Manage your suppliers and vendor relationships"
          badge={{ text: "Vendor Management", variant: "outline" }}
        />

        <SupplierManagement />
      </div>
    </div>
  );
};

export default SuppliersPage;
