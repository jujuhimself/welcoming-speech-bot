
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Package, Settings, Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface Props {
  systemStats: {
    pharmacies: number;
    wholesalers: number;
    labs: number;
    individuals: number;
  };
}

const AdminOverviewTab = ({ systemStats }: Props) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pharmacies</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats.pharmacies}</div>
          <p className="text-xs text-muted-foreground">Retail partners</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wholesalers</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats.wholesalers}</div>
          <p className="text-xs text-muted-foreground">Distribution partners</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Labs</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats.labs}</div>
          <p className="text-xs text-muted-foreground">Laboratory partners</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Individuals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemStats.individuals}</div>
          <p className="text-xs text-muted-foreground">Individual users</p>
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Recent Platform Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">New pharmacy approved</p>
                <p className="text-sm text-gray-600">City Pharmacy - Dar es Salaam</p>
              </div>
            </div>
            <Badge variant="default">2 hours ago</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Large order processed</p>
                <p className="text-sm text-gray-600">TZS 2,450,000 - MedSupply to HealthPharm</p>
              </div>
            </div>
            <Badge variant="outline">4 hours ago</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">System maintenance scheduled</p>
                <p className="text-sm text-gray-600">Weekend update - June 8-9</p>
              </div>
            </div>
            <Badge variant="secondary">Upcoming</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminOverviewTab;
