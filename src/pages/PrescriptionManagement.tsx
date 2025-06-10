
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Plus, 
  Search, 
  Upload, 
  Phone, 
  User, 
  Clock,
  CheckCircle,
  Package,
  Truck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MockDataService, Prescription } from "@/services/mockDataService";
import { useToast } from "@/hooks/use-toast";

const PrescriptionManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    patientPhone: "",
    doctorName: "",
    medications: [{
      name: "",
      dosage: "",
      frequency: "",
      duration: ""
    }]
  });

  useEffect(() => {
    // Load prescriptions based on user role
    const prescriptionsData = MockDataService.getPrescriptions();
    if (user?.role === 'individual') {
      // Individual users see their own prescriptions
      setPrescriptions(prescriptionsData.filter(p => p.patientName.includes('John')));
    } else {
      // Pharmacies see all prescriptions
      setPrescriptions(prescriptionsData);
    }
  }, [user]);

  const handleCreatePrescription = () => {
    if (!newPrescription.patientName || !newPrescription.patientPhone || !newPrescription.doctorName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const prescription: Prescription = {
      id: `RX-${Date.now()}`,
      patientName: newPrescription.patientName,
      patientPhone: newPrescription.patientPhone,
      doctorName: newPrescription.doctorName,
      medications: newPrescription.medications.filter(med => med.name),
      status: 'pending',
      uploadDate: new Date().toISOString(),
      imageUrl: 'uploaded-prescription.jpg'
    };

    setPrescriptions([prescription, ...prescriptions]);
    setIsNewPrescriptionOpen(false);
    setNewPrescription({
      patientName: "",
      patientPhone: "",
      doctorName: "",
      medications: [{
        name: "",
        dosage: "",
        frequency: "",
        duration: ""
      }]
    });
    
    toast({
      title: "Prescription Uploaded",
      description: "Your prescription has been submitted for processing."
    });
  };

  const handleUpdateStatus = (prescriptionId: string, newStatus: Prescription['status']) => {
    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, status: newStatus }
        : prescription
    ));
    
    toast({
      title: "Status Updated",
      description: `Prescription status updated to ${newStatus}.`
    });
  };

  const addMedication = () => {
    setNewPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "" }]
    }));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processed': return <FileText className="h-4 w-4" />;
      case 'ready': return <Package className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = {
    total: prescriptions.length,
    pending: prescriptions.filter(p => p.status === 'pending').length,
    ready: prescriptions.filter(p => p.status === 'ready').length,
    delivered: prescriptions.filter(p => p.status === 'delivered').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Prescription Management</h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'individual' 
                ? 'Upload and track your prescriptions'
                : 'Process and manage patient prescriptions'
              }
            </p>
          </div>
          <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-5 w-5 mr-2" />
                Upload Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Prescription</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient name"
                      value={newPrescription.patientName}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, patientName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientPhone">Patient Phone</Label>
                    <Input
                      id="patientPhone"
                      placeholder="Enter phone number"
                      value={newPrescription.patientPhone}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, patientPhone: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    placeholder="Enter doctor name"
                    value={newPrescription.doctorName}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, doctorName: e.target.value }))}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Medications</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Medication
                    </Button>
                  </div>
                  
                  {newPrescription.medications.map((medication, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-3 space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Medication Name</Label>
                          <Input
                            placeholder="e.g., Paracetamol 500mg"
                            value={medication.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Dosage</Label>
                          <Input
                            placeholder="e.g., 500mg"
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Frequency</Label>
                          <Input
                            placeholder="e.g., 3 times daily"
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g., 7 days"
                            value={medication.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleCreatePrescription} className="w-full">
                  Submit Prescription
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No prescriptions found</h3>
                <p className="text-gray-500 mb-6">Upload your first prescription to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {prescription.patientName}
                        </h4>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4" />
                          {prescription.patientPhone}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Prescription ID: {prescription.id}
                        </p>
                      </div>
                      <Badge className={getStatusColor(prescription.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(prescription.status)}
                          {prescription.status.toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Prescribed by</p>
                      <p className="font-medium">{prescription.doctorName}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Medications</p>
                      <div className="space-y-2">
                        {prescription.medications.map((medication, index) => (
                          <div key={index} className="bg-gray-50 rounded p-3">
                            <p className="font-medium">{medication.name}</p>
                            <div className="grid md:grid-cols-3 gap-2 mt-1 text-sm text-gray-600">
                              <span>Dosage: {medication.dosage}</span>
                              <span>Frequency: {medication.frequency}</span>
                              <span>Duration: {medication.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Uploaded: {new Date(prescription.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {(user?.role === 'retail' || user?.role === 'wholesale') && (
                      <div className="flex gap-2">
                        {prescription.status === 'pending' && (
                          <Button 
                            onClick={() => handleUpdateStatus(prescription.id, 'processed')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark as Processed
                          </Button>
                        )}
                        {prescription.status === 'processed' && (
                          <Button 
                            onClick={() => handleUpdateStatus(prescription.id, 'ready')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark as Ready
                          </Button>
                        )}
                        {prescription.status === 'ready' && (
                          <Button 
                            onClick={() => handleUpdateStatus(prescription.id, 'delivered')}
                            className="bg-gray-600 hover:bg-gray-700"
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
