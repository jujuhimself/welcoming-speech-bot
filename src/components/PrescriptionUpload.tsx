
import { useEffect, useState } from "react";
import PrescriptionUploadForm from "./PrescriptionUploadForm";
import PrescriptionHistoryList from "./PrescriptionHistoryList";
import { getFileUrl, deleteFile } from "@/services/storageService";
import { auditService } from "@/services/auditService";
import { useAuth } from "@/contexts/AuthContext";

interface PrescriptionFile {
  id: string;
  fileName: string;
  uploadDate: string;
  doctorName: string;
  notes: string;
  filePath: string;
  viewUrl: string;
  status: 'pending' | 'processed' | 'filled';
  pharmacyName?: string;
}

const PrescriptionUpload = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load prescription file refs from storage
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data, error } = await (window as any).supabase.storage
          .from("prescriptions")
          .list(`${user.id}/`);
        if (error || !data) {
          setPrescriptions([]);
          return;
        }
        const history: PrescriptionFile[] = await Promise.all(
          data.map(async (file: any) => {
            const url = await getFileUrl("prescriptions", `${user.id}/${file.name}`);
            return {
              id: file.id || file.name,
              fileName: file.name.split("_").slice(1).join("_"),
              uploadDate: new Date(file.created_at || Date.now()).toISOString(),
              doctorName: "",
              notes: "",
              filePath: `${user.id}/${file.name}`,
              viewUrl: url || "",
              status: "pending",
              pharmacyName: "",
            };
          })
        );
        setPrescriptions(history.reverse());
      } catch (err) {
        setPrescriptions([]);
      }
    })();
  }, [user?.id, isUploading]);

  const handleDelete = async (filePath: string) => {
    if (!user?.id) return;
    try {
      await deleteFile("prescriptions", filePath);
      await auditService.logAction(
        "delete-prescription",
        "prescription",
        undefined,
        { filePath }
      );
      setPrescriptions((prev) =>
        prev.filter((p) => p.filePath !== filePath)
      );
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // Rerender after upload
  const handleUploadSuccess = () => {
    setIsUploading(isUploading => !isUploading);
  };

  return (
    <div className="space-y-6">
      <PrescriptionUploadForm onUploadSuccess={handleUploadSuccess} />
      <PrescriptionHistoryList
        prescriptions={prescriptions}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PrescriptionUpload;
