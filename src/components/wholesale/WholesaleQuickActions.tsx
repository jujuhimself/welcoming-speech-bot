
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, FileText, BarChart3, Users } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const WholesaleQuickActions = () => (
  <Card className="mb-8 shadow-lg border-0">
    <CardHeader>
      <CardTitle className="text-2xl">Business Management</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild className="h-24 flex-col bg-blue-600 hover:bg-blue-700 text-white">
          <Link to="/wholesale/inventory">
            <Package className="h-8 w-8 mb-2" />
            Inventory Management
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
          <Link to="/wholesale/orders">
            <FileText className="h-8 w-8 mb-2" />
            Order Management
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
          <Link to="/wholesale/analytics">
            <BarChart3 className="h-8 w-8 mb-2" />
            Business Analytics
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
          <Link to="/wholesale/retailers">
            <Users className="h-8 w-8 mb-2" />
            Retailer Management
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default WholesaleQuickActions;
