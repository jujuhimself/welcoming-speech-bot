
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Pharmacy {
  id: number;
  name: string;
  distance: string;
  rating: number;
  open: boolean;
}

const NearbyPharmacies = ({ pharmacies }: { pharmacies: Pharmacy[] }) => (
  <Card className="shadow-lg border-0">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl">Nearby Pharmacies</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/pharmacy-directory">View All</Link>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {pharmacies.map((pharmacy) => (
          <div key={pharmacy.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-semibold text-lg">{pharmacy.name}</p>
              <p className="text-gray-600">{pharmacy.distance} away</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-yellow-500">★ {pharmacy.rating}</span>
                <Badge variant={pharmacy.open ? "default" : "secondary"}>
                  {pharmacy.open ? "Open" : "Closed"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pharmacy-directory">View Store</Link>
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default NearbyPharmacies;
