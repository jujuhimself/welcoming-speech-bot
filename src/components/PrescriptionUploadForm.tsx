
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, FileText, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadFile } from "@/services/storageService";
import { auditService } from "@/services/auditService";

export interface PrescriptionUploadFormProps {
  onUploadSuccess?: () => void;
}

const PrescriptionUploadForm = ({ onUploadSuccess }: PrescriptionUploadFormProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    doctorName: "",
    notes: "",
    selectedFile: null as File | null,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({ ...prev, selectedFile: file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.selectedFile || !uploadForm.doctorName || !user?.id) {
      alert("Please select a file and enter doctor name");
      return;
    }
    setIsUploading(true);
    try {
      const { path } = await uploadFile({
        file: uploadForm.selectedFile,
        userId: user.id,
        bucket: "prescriptions",
        extraPath: "",
      });
      setUploadForm({
        doctorName: "",
        notes: "",
        selectedFile: null,
      });
      await auditService.logAction(
        "upload-prescription",
        "prescription",
        undefined,
        undefined,
        { doctorName: uploadForm.doctorName, filePath: path }
      );
      setIsUploading(false);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      alert("Upload failed");
      setIsUploading(false);
    }
  };

  return (
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
                  onClick={() =>
                    setUploadForm((prev) => ({ ...prev, selectedFile: null }))
                  }
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
            onChange={(e) =>
              setUploadForm((prev) => ({
                ...prev,
                doctorName: e.target.value,
              }))
            }
          />
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special instructions or notes about this prescription"
            value={uploadForm.notes}
            onChange={(e) =>
              setUploadForm((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            rows={3}
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!uploadForm.selectedFile || !uploadForm.doctorName || isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Upload Prescription"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrescriptionUploadForm;
