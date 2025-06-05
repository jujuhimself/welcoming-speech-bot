
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Camera, X, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Prescription {
  id: string;
  fileName: string;
  uploadDate: string;
  doctorName: string;
  notes: string;
  status: 'pending' | 'processed' | 'filled';
  pharmacyName?: string;
}

const PrescriptionUpload = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    doctorName: '',
    notes: '',
    selectedFile: null as File | null
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, selectedFile: file }));
    }
  };

  const handleUpload = () => {
    if (!uploadForm.selectedFile || !uploadForm.doctorName) {
      alert('Please select a file and enter doctor name');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newPrescription: Prescription = {
        id: Date.now().toString(),
        fileName: uploadForm.selectedFile!.name,
        uploadDate: new Date().toISOString(),
        doctorName: uploadForm.doctorName,
        notes: uploadForm.notes,
        status: 'pending'
      };

      setPrescriptions(prev => [newPrescription, ...prev]);
      
      // Save to localStorage
      const userPrescriptions = JSON.parse(localStorage.getItem(`bepawa_prescriptions_${user?.id}`) || '[]');
      userPrescriptions.unshift(newPrescription);
      localStorage.setItem(`bepawa_prescriptions_${user?.id}`, JSON.stringify(userPrescriptions));
      
      // Reset form
      setUploadForm({
        doctorName: '',
        notes: '',
        selectedFile: null
      });
      
      setIsUploading(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processed': return 'bg-blue-500';
      case 'filled': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'processed': return 'Being Processed';
      case 'filled': return 'Prescription Filled';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload Prescription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="prescription-file">Prescription Image/PDF</Label>
            <div className="mt-2">
              <Input
                id="prescription-file"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadForm.selectedFile && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{uploadForm.selectedFile.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setUploadForm(prev => ({ ...prev, selectedFile: null }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Camera Option */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Camera className="h-4 w-4" />
            <span>You can also take a photo directly using your camera</span>
          </div>

          {/* Doctor Information */}
          <div>
            <Label htmlFor="doctor-name">Doctor's Name</Label>
            <Input
              id="doctor-name"
              placeholder="Enter prescribing doctor's name"
              value={uploadForm.doctorName}
              onChange={(e) => setUploadForm(prev => ({ ...prev, doctorName: e.target.value }))}
            />
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes about this prescription"
              value={uploadForm.notes}
              onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!uploadForm.selectedFile || !uploadForm.doctorName || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Prescription'}
          </Button>
        </CardContent>
      </Card>

      {/* Prescription History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No prescriptions uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{prescription.fileName}</h4>
                      <p className="text-sm text-gray-600">Dr. {prescription.doctorName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(prescription.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(prescription.status)}>
                        {getStatusText(prescription.status)}
                      </Badge>
                      {prescription.pharmacyName && (
                        <p className="text-xs text-gray-600 mt-1">
                          {prescription.pharmacyName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {prescription.notes && (
                    <p className="text-sm text-gray-600 mb-2">{prescription.notes}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {prescription.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Find Pharmacy
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionUpload;
