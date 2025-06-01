
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface OrderHistory {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  orderDate: string;
  image: string;
}

const QuickReorder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load order history from localStorage
      const historyKey = `bepawa_order_history_${user.id}`;
      const storedHistory = localStorage.getItem(historyKey);
      if (storedHistory) {
        setOrderHistory(JSON.parse(storedHistory));
      } else {
        // Initialize with sample order history
        const sampleHistory: OrderHistory[] = [
          {
            id: "1",
            productId: "1",
            productName: "Paracetamol 500mg",
            quantity: 2,
            price: 1500,
            orderDate: "2024-05-20",
            image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
          },
          {
            id: "2",
            productId: "6",
            productName: "Digital Thermometer",
            quantity: 1,
            price: 12000,
            orderDate: "2024-05-18",
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400"
          },
          {
            id: "3",
            productId: "3",
            productName: "Latex Gloves (Box of 100)",
            quantity: 3,
            price: 15000,
            orderDate: "2024-05-15",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
          }
        ];
        localStorage.setItem(historyKey, JSON.stringify(sampleHistory));
        setOrderHistory(sampleHistory);
      }
    }
  }, [user]);

  const quickReorder = (item: OrderHistory) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to reorder items",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Add to cart
    const cartKey = `bepawa_cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const existingItem = existingCart.find((cartItem: any) => cartItem.id === item.productId);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      existingCart.push({
        id: item.productId,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Reordered successfully",
        description: `${item.productName} (x${item.quantity}) has been added to your cart`,
      });
    }, 1000);
  };

  if (!user || orderHistory.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary-600" />
          Quick Reorder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderHistory.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-sm">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Qty: {item.quantity}</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(item.orderDate).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => quickReorder(item)}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="h-3 w-3" />
                Reorder
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickReorder;
