
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PharmacyFinder from "@/components/PharmacyFinder";

const Pharmacies = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Find Pharmacies</h1>
          <p className="text-gray-600">Locate nearby pharmacies and browse their products</p>
        </div>

        <PharmacyFinder />
      </div>
    </div>
  );
};

export default Pharmacies;
