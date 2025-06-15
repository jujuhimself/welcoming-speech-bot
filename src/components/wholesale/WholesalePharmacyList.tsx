
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: any[];
}

interface WholesalePharmacyListProps {
  pharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  loading: boolean;
}

const WholesalePharmacyList = ({ pharmacies, selectedPharmacy, onSelectPharmacy, loading }: WholesalePharmacyListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Pharmacy Partners ({pharmacies.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2 p-4">
          {loading ? (
            <div>Loading...</div>
          ) : pharmacies.length === 0 ? (
            <div className="text-gray-600">No pharmacies found.</div>
          ) : pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPharmacy?.id === pharmacy.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onSelectPharmacy(pharmacy)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{pharmacy.name}</h3>
                <Badge variant="outline">{pharmacy.totalOrders} orders</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">{pharmacy.contactPerson}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPin className="h-3 w-3" />
                {pharmacy.location}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">
                  TZS {(pharmacy.totalSpent / 1000000).toFixed(1)}M
                </span>
                <span className="text-gray-500">
                  Last: {pharmacy.lastOrderDate ? new Date(pharmacy.lastOrderDate).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WholesalePharmacyList;
