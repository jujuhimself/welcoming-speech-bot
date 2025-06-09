
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Star, Clock, Phone, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";

const PharmacyDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [orderModal, setOrderModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

  const pharmacies = [
    {
      id: 1,
      name: "City Pharmacy",
      location: "Dar es Salaam CBD",
      distance: "0.5 km",
      rating: 4.8,
      reviews: 124,
      open: true,
      hours: "24/7",
      phone: "+255 123 456 789",
      services: ["Prescription", "OTC", "Consultation", "Delivery"],
      stock: [
        { name: "Paracetamol 500mg", price: 5000, available: true },
        { name: "Amoxicillin 250mg", price: 15000, available: true },
        { name: "Vitamin C", price: 8000, available: false },
        { name: "Insulin", price: 45000, available: true }
      ]
    },
    {
      id: 2,
      name: "HealthCare Plus",
      location: "Masaki",
      distance: "1.2 km",
      rating: 4.6,
      reviews: 89,
      open: true,
      hours: "8:00 AM - 10:00 PM",
      phone: "+255 123 456 790",
      services: ["Prescription", "OTC", "Lab Tests"],
      stock: [
        { name: "Paracetamol 500mg", price: 4800, available: true },
        { name: "Blood pressure monitor", price: 85000, available: true },
        { name: "Diabetes test strips", price: 25000, available: true }
      ]
    },
    {
      id: 3,
      name: "MediPoint",
      location: "Mikocheni",
      distance: "2.1 km",
      rating: 4.7,
      reviews: 156,
      open: false,
      hours: "9:00 AM - 9:00 PM",
      phone: "+255 123 456 791",
      services: ["Prescription", "OTC", "Consultation"],
      stock: [
        { name: "Cough syrup", price: 12000, available: true },
        { name: "Antibiotics", price: 18000, available: true }
      ]
    }
  ];

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrder = () => {
    if (selectedMedicine && quantity > 0) {
      // Mock order creation
      console.log("Order placed:", { pharmacy: selectedPharmacy, medicine: selectedMedicine, quantity });
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
          {filteredPharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{pharmacy.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{pharmacy.location}</span>
                    </div>
                  </div>
                  <Badge variant={pharmacy.open ? "default" : "secondary"}>
                    {pharmacy.open ? "Open" : "Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{pharmacy.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({pharmacy.reviews})</span>
                    </div>
                    <span className="text-sm text-gray-600">{pharmacy.distance} away</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pharmacy.hours}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pharmacy.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {pharmacy.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-3 space-y-2">
                    <Button className="w-full" onClick={() => setSelectedPharmacy(pharmacy)}>
                      View Stock & Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pharmacy Details Modal */}
        <Dialog open={!!selectedPharmacy} onOpenChange={() => setSelectedPharmacy(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPharmacy?.name} - Available Stock</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPharmacy?.stock.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600">TZS {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "In Stock" : "Out of Stock"}
                    </Badge>
                    {item.available && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedMedicine(item.name);
                          setOrderModal(true);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Order
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

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
