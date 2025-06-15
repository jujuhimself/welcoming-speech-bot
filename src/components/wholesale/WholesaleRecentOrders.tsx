
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Order = {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
  pharmacy_id?: string;
  pharmacy_name?: string;
};

const WholesaleRecentOrders = ({ orders }: { orders: Order[] }) => (
  <Card className="shadow-lg border-0">
    <CardHeader>
      <CardTitle className="text-2xl">Recent B2B Orders</CardTitle>
    </CardHeader>
    <CardContent>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No orders yet</p>
          <Button asChild size="lg">
            <Link to="/wholesale/catalog">Manage Product Catalog</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order.order_number || order.id}
                </p>
                <p className="text-gray-600">From: {order.pharmacy_name || order.pharmacy_id}</p>
                <p className="text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                <p className="font-bold text-green-600">TZS {Number(order.total_amount).toLocaleString()}</p>
              </div>
              <Badge className="bg-blue-500 text-white">
                {order.status.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          ))}
          <Button asChild variant="outline" className="w-full mt-4" size="lg">
            <Link to="/wholesale/orders">View All Orders</Link>
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default WholesaleRecentOrders;
