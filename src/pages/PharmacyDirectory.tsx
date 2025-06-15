import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Star, Clock, Phone, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import PharmacyCard from "@/components/PharmacyCard";
import PharmacyStockDialog from "@/components/PharmacyStockDialog";

const PharmacyDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [orderModal, setOrderModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Empty pharmacies list - no mock data
  const pharmacies: any[] = [];

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrder = () => {
    if (selectedMedicine && quantity > 0) {
      // Place order logic stub
      setOrderModal(false);
      setSelectedMedicine("");
      setQuantity(1);
      alert("Order placed successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Pharmacies</h1>
          <p className="text-gray-600 text-lg">Discover nearby pharmacies and order medicines</p>
        </div>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by pharmacy name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
        {/* Pharmacy Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPharmacies.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-24">
              <p className="text-2xl mb-2">No pharmacies found.</p>
              <p className="mb-8">Once pharmacies are available, you'll be able to browse here.</p>
            </div>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onViewStock={() => setSelectedPharmacy(pharmacy)}
              />
            ))
          )}
        </div>
        {/* Pharmacy Details Modal */}
        <PharmacyStockDialog
          open={!!selectedPharmacy}
          onOpenChange={() => setSelectedPharmacy(null)}
          pharmacyName={selectedPharmacy?.name}
          stock={selectedPharmacy?.stock}
          onOrder={(medicine: string) => {
            setSelectedMedicine(medicine);
            setOrderModal(true);
          }}
        />
        {/* Order Modal */}
        <Dialog open={orderModal} onOpenChange={setOrderModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Medicine</label>
                <Input value={selectedMedicine} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleOrder} className="flex-1">Confirm Order</Button>
                <Button variant="outline" onClick={() => setOrderModal(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PharmacyDirectory;
