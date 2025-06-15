
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface HealthSummaryProps {
  totalOrders: number;
  recentOrders: any[];
}

const HealthSummary = ({ totalOrders, recentOrders }: HealthSummaryProps) => (
  <Card className="shadow-lg border-0">
    <CardHeader>
      <CardTitle className="text-2xl">Health Summary</CardTitle>
    </CardHeader>
    <CardContent>
      {totalOrders === 0 ? (
        <div className="space-y-6">
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No orders yet</p>
            <Button asChild size="lg">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Health Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Keep a digital copy of your prescriptions</p>
              <p>• Set medication reminders</p>
              <p>• Check expiry dates regularly</p>
              <p>• Consult with pharmacists for advice</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Orders</h3>
          {recentOrders.map((order: any) => (
            <div key={order.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50">
              <div>
                <p className="font-semibold">Order #{order.order_number || order.id}</p>
                <p className="text-gray-600">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "Unknown date"}</p>
                <p className="font-bold text-blue-600">
                  TZS {order.total_amount ? Number(order.total_amount).toLocaleString() : "?"}
                </p>
              </div>
              <Badge>{order.status}</Badge>
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link to="/orders">View All Orders</Link>
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default HealthSummary;
