
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Search, Star, Clock, Phone, Calendar, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

const LabDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientNotes, setPatientNotes] = useState("");

  const labs = [
    {
      id: 1,
      name: "QuickLab Diagnostics",
      location: "Dar es Salaam CBD",
      distance: "0.8 km",
      rating: 4.9,
      reviews: 234,
      open: true,
      hours: "6:00 AM - 10:00 PM",
      phone: "+255 123 456 800",
      services: ["Blood Tests", "Radiology", "Pathology", "Home Collection"],
      tests: [
        { name: "Complete Blood Count (CBC)", price: 25000, duration: "2 hours" },
        { name: "Lipid Profile", price: 35000, duration: "4 hours" },
        { name: "Liver Function Test", price: 40000, duration: "6 hours" },
        { name: "Thyroid Function Test", price: 55000, duration: "24 hours" },
        { name: "HbA1c (Diabetes)", price: 30000, duration: "4 hours" }
      ],
      facilities: ["Digital X-Ray", "Ultrasound", "ECG", "Pharmacy"]
    },
    {
      id: 2,
      name: "MediTest Center",
      location: "Masaki",
      distance: "1.5 km",
      rating: 4.7,
      reviews: 189,
      open: true,
      hours: "7:00 AM - 8:00 PM",
      phone: "+255 123 456 801",
      services: ["Blood Tests", "Urine Tests", "Stool Tests", "Consultation"],
      tests: [
        { name: "Basic Metabolic Panel", price: 20000, duration: "2 hours" },
        { name: "Urinalysis", price: 15000, duration: "1 hour" },
        { name: "Pregnancy Test", price: 10000, duration: "30 minutes" },
        { name: "HIV Test", price: 25000, duration: "1 hour" }
      ],
      facilities: ["Sample Collection", "Consultation Rooms", "Waiting Area"]
    },
    {
      id: 3,
      name: "City Lab Services",
      location: "Mikocheni",
      distance: "2.1 km",
      rating: 4.5,
      reviews: 145,
      open: false,
      hours: "8:00 AM - 6:00 PM",
      phone: "+255 123 456 802",
      services: ["Specialized Tests", "Genetic Testing", "Allergy Tests"],
      tests: [
        { name: "Allergy Panel", price: 85000, duration: "48 hours" },
        { name: "Vitamin D Test", price: 45000, duration: "24 hours" },
        { name: "Cancer Markers", price: 120000, duration: "72 hours" }
      ],
      facilities: ["Advanced Equipment", "Specialist Consultation"]
    }
  ];

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBooking = () => {
    if (selectedTest && appointmentDate && appointmentTime) {
      console.log("Appointment booked:", {
        lab: selectedLab,
        test: selectedTest,
        date: appointmentDate,
        time: appointmentTime,
        notes: patientNotes
      });
      setBookingModal(false);
      setSelectedTest("");
      setAppointmentDate("");
      setAppointmentTime("");
      setPatientNotes("");
      alert("Appointment booked successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Laboratory Directory</h1>
          <p className="text-gray-600 text-lg">Find labs and book diagnostic tests</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search labs, tests, or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Lab Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{lab.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{lab.location}</span>
                    </div>
                  </div>
                  <Badge variant={lab.open ? "default" : "secondary"}>
                    {lab.open ? "Open" : "Closed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{lab.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({lab.reviews})</span>
                    </div>
                    <span className="text-sm text-gray-600">{lab.distance} away</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{lab.hours}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="text-sm">{lab.phone}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lab.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-3">
                    <Button className="w-full" onClick={() => setSelectedLab(lab)}>
                      View Tests & Book
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lab Details Modal */}
        <Dialog open={!!selectedLab} onOpenChange={() => setSelectedLab(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedLab?.name} - Available Tests</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedLab?.tests.map((test: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{test.name}</h4>
                    <p className="text-gray-600">TZS {test.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Results in: {test.duration}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedTest(test.name);
                      setBookingModal(true);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Book Test
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Facilities Available:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedLab?.facilities.map((facility: string, index: number) => (
                  <Badge key={index} variant="outline">{facility}</Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Booking Modal */}
        <Dialog open={bookingModal} onOpenChange={setBookingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Lab Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Selected Test</label>
                <Input value={selectedTest} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Appointment Date</label>
                <Input 
                  type="date" 
                  value={appointmentDate} 
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Appointment Time</label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <Textarea 
                  placeholder="Any special instructions or symptoms..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleBooking} className="flex-1">Confirm Booking</Button>
                <Button variant="outline" onClick={() => setBookingModal(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LabDirectory;
