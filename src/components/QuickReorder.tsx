
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PastOrder {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

const QuickReorder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

  useEffect(() => {
    if (user) {
      const orders = JSON.parse(localStorage.getItem('bepawa_orders') || '[]');
      const userOrders = orders
        .filter((order: any) => order.pharmacyId === user.id)
        .slice(0, 3); // Show last 3 orders
      setPastOrders(userOrders);
    }
  }, [user]);

  const reorderItems = (order: PastOrder) => {
    if (!user) return;

    const cartKey = `bepawa_cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    order.items.forEach(item => {
      const existingItem = existingCart.find((cartItem: any) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        existingCart.push({ ...item });
      }
    });
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    toast({
      title: "Items added to cart",
      description: `${order.items.length} items from order #${order.id} have been added to your cart`,
    });
  };

  if (pastOrders.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Quick Reorder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {pastOrders.map((order) => (
            <Card key={order.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">Order #{order.id}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">TZS {order.total.toLocaleString()}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">{order.items.length} items:</p>
                  <div className="text-xs text-gray-500">
                    {order.items.slice(0, 2).map(item => item.name).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </div>
                </div>
                
                <Button 
                  onClick={() => reorderItems(order)}
                  size="sm" 
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reorder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReorder;
