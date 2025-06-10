
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  User, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Pill,
  Eye,
  Download,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  hospitalName: string;
  medications: Medication[];
  status: 'pending' | 'reviewed' | 'processed' | 'ready' | 'dispensed' | 'rejected';
  createdAt: string;
  processedAt?: string;
  dispensedAt?: string;
  notes?: string;
  pharmacyNotes?: string;
  totalCost?: number;
  priority: 'normal' | 'urgent';
}

const PrescriptionManagement = () => {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [pharmacyNotes, setPharmacyNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data for prescriptions
    const mockPrescriptions: Prescription[] = [
      {
        id: "RX001",
        patientName: "John Mwangi",
        patientId: "PAT001",
        doctorName: "Dr. Sarah Kimani",
        hospitalName: "Aga Khan Hospital",
        medications: [
          {
            name: "Amoxicillin 500mg",
            dosage: "500mg",
            frequency: "3 times daily",
            duration: "7 days",
            quantity: 21,
            instructions: "Take with food"
          },
          {
            name: "Paracetamol 500mg",
            dosage: "500mg",
            frequency: "As needed",
            duration: "5 days",
            quantity: 10,
            instructions: "For pain relief, max 4 times daily"
          }
        ],
        status: "pending",
        createdAt: "2024-01-15T10:00:00Z",
        priority: "normal",
        notes: "Patient has mild penicillin sensitivity - monitor for reactions"
      },
      {
        id: "RX002", 
        patientName: "Mary Wanjiku",
        patientId: "PAT002",
        doctorName: "Dr. James Ochieng",
        hospitalName: "Kenyatta National Hospital",
        medications: [
          {
            name: "Metformin 500mg",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "30 days",
            quantity: 60,
            instructions: "Take with breakfast and dinner"
          },
          {
            name: "Atorvastatin 20mg",
            dosage: "20mg",
            frequency: "Once daily",
            duration: "30 days",
            quantity: 30,
            instructions: "Take in the evening"
          }
        ],
        status: "processed",
        createdAt: "2024-01-14T14:30:00Z",
        processedAt: "2024-01-14T16:00:00Z",
        priority: "normal",
        totalCost: 3500,
        pharmacyNotes: "All medications in stock and prepared"
      },
      {
        id: "RX003",
        patientName: "David Kariuki",
        patientId: "PAT003", 
        doctorName: "Dr. Grace Mutua",
        hospitalName: "Nairobi Hospital",
        medications: [
          {
            name: "Salbutamol Inhaler",
            dosage: "100mcg",
            frequency: "2 puffs as needed",
            duration: "30 days",
            quantity: 1,
            instructions: "For acute asthma symptoms"
          }
        ],
        status: "dispensed",
        createdAt: "2024-01-13T09:15:00Z",
        processedAt: "2024-01-13T10:00:00Z",
        dispensedAt: "2024-01-13T11:30:00Z",
        priority: "urgent",
        totalCost: 1200,
        pharmacyNotes: "Patient counseled on proper inhaler technique"
      }
    ];
    setPrescriptions(mockPrescriptions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800'; 
      case 'processed': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'dispensed': return 'bg-green-200 text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'reviewed': return Eye;
      case 'processed': return Pill;
      case 'ready': return CheckCircle;
      case 'dispensed': return CheckCircle;
      case 'rejected': return AlertTriangle;
      default: return FileText;
    }
  };

  const handleStatusUpdate = (prescriptionId: string, newStatus: Prescription['status']) => {
    const updatedPrescriptions = prescriptions.map(prescription => {
      if (prescription.id === prescriptionId) {
        const updates: Partial<Prescription> = {
          status: newStatus,
          pharmacyNotes: pharmacyNotes || prescription.pharmacyNotes
        };
        
        if (newStatus === 'processed') {
          updates.processedAt = new Date().toISOString();
        } else if (newStatus === 'dispensed') {
          updates.dispensedAt = new Date().toISOString();
        }
        
        return { ...prescription, ...updates };
      }
      return prescription;
    });
    
    setPrescriptions(updatedPrescriptions);
    setSelectedPrescription(null);
    setPharmacyNotes("");
    
    toast({
      title: "Prescription Updated",
      description: `Prescription ${prescriptionId} has been ${newStatus}.`,
    });
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const processedCount = prescriptions.filter(p => p.status === 'processed').length;
  const dispensedCount = prescriptions.filter(p => p.status === 'dispensed').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prescription Management</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-purple-600">{processedCount}</p>
              </div>
              <Pill className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dispensed</p>
                <p className="text-2xl font-bold text-green-600">{dispensedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-primary-600">{prescriptions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => {
              const StatusIcon = getStatusIcon(prescription.status);
              return (
                <div key={prescription.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <StatusIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                          {prescription.priority === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">URGENT</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Prescription ID: {prescription.id}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Doctor:</span>
                            <p className="font-medium">{prescription.doctorName}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Hospital:</span>
                            <p className="font-medium">{prescription.hospitalName}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Medications:</span>
                            <p className="font-medium">{prescription.medications.length} items</p>
                          </div>
                        </div>
                        {prescription.totalCost && (
                          <div className="text-sm">
                            <span className="text-gray-600">Total Cost:</span>
                            <span className="font-medium ml-1">TZS {prescription.totalCost.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status.toUpperCase()}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPrescription(prescription)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Prescription Details - {prescription.patientName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Patient & Doctor Info */}
                            <div className="grid grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Patient Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-gray-600">Name:</span>
                                      <p className="font-medium">{prescription.patientName}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Patient ID:</span>
                                      <p className="font-medium">{prescription.patientId}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Prescriber Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-gray-600">Doctor:</span>
                                      <p className="font-medium">{prescription.doctorName}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-600">Hospital:</span>
                                      <p className="font-medium">{prescription.hospitalName}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Medications */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Medications</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {prescription.medications.map((medication, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                          <span className="text-sm text-gray-600">Medication:</span>
                                          <p className="font-medium">{medication.name}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">Dosage:</span>
                                          <p className="font-medium">{medication.dosage}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">Frequency:</span>
                                          <p className="font-medium">{medication.frequency}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">Duration:</span>
                                          <p className="font-medium">{medication.duration}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">Quantity:</span>
                                          <p className="font-medium">{medication.quantity}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">Instructions:</span>
                                          <p className="font-medium">{medication.instructions}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Notes */}
                            {prescription.notes && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Doctor's Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p>{prescription.notes}</p>
                                </CardContent>
                              </Card>
                            )}

                            {/* Pharmacy Actions */}
                            {prescription.status !== 'dispensed' && prescription.status !== 'rejected' && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Pharmacy Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Pharmacy Notes</label>
                                    <Textarea
                                      value={pharmacyNotes}
                                      onChange={(e) => setPharmacyNotes(e.target.value)}
                                      placeholder="Add any notes about processing this prescription..."
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-3">
                                    {prescription.status === 'pending' && (
                                      <Button 
                                        onClick={() => handleStatusUpdate(prescription.id, 'reviewed')}
                                        variant="outline"
                                      >
                                        Mark as Reviewed
                                      </Button>
                                    )}
                                    {(prescription.status === 'pending' || prescription.status === 'reviewed') && (
                                      <Button 
                                        onClick={() => handleStatusUpdate(prescription.id, 'processed')}
                                        className="bg-purple-600 hover:bg-purple-700"
                                      >
                                        Mark as Processed
                                      </Button>
                                    )}
                                    {prescription.status === 'processed' && (
                                      <Button 
                                        onClick={() => handleStatusUpdate(prescription.id, 'ready')}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Mark as Ready
                                      </Button>
                                    )}
                                    {prescription.status === 'ready' && (
                                      <Button 
                                        onClick={() => handleStatusUpdate(prescription.id, 'dispensed')}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        Mark as Dispensed
                                      </Button>
                                    )}
                                    <Button 
                                      onClick={() => handleStatusUpdate(prescription.id, 'rejected')}
                                      variant="destructive"
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {prescription.pharmacyNotes && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Pharmacy Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p>{prescription.pharmacyNotes}</p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionManagement;
