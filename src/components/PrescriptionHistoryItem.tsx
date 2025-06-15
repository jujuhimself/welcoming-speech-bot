
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, X } from "lucide-react";

export interface PrescriptionHistoryItemProps {
  prescription: {
    fileName: string;
    doctorName: string;
    uploadDate: string;
    notes: string;
    viewUrl: string;
    status: string;
    pharmacyName?: string;
    filePath: string;
  };
  onDelete: (filePath: string) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "processed":
      return "bg-blue-500";
    case "filled":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}
function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "processed":
      return "Being Processed";
    case "filled":
      return "Prescription Filled";
    default:
      return "Unknown";
  }
}

const PrescriptionHistoryItem = ({
  prescription,
  onDelete,
}: PrescriptionHistoryItemProps) => (
  <div className="border rounded-lg p-4 hover:bg-gray-50">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-medium">{prescription.fileName}</h4>
        <p className="text-sm text-gray-600">
          Dr. {prescription.doctorName || "[unknown]"}
        </p>
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
      {prescription.viewUrl ? (
        <a
          href={prescription.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </a>
      ) : (
        <Button size="sm" variant="outline" disabled>
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(prescription.filePath)}
      >
        <X className="h-3 w-3 mr-1" />
        Delete
      </Button>
    </div>
  </div>
);

export default PrescriptionHistoryItem;
