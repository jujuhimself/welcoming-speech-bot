
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PrescriptionUpload from "@/components/PrescriptionUpload";

const Prescriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'individual') {
    navigate('/login');
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600">Upload and manage your medical prescriptions</p>
        </div>

        <PrescriptionUpload />
      </div>
    </div>
  );
};

export default Prescriptions;
