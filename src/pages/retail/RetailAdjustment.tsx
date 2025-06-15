
import { useState, useEffect } from "react";
import { inventoryAdjustmentService, InventoryAdjustment } from "@/services/inventoryAdjustmentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function RetailAdjustment() {
  const { user } = useAuth();
  const [product_id, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("add");
  const [reason, setReason] = useState("");
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);

  useEffect(() => {
    inventoryAdjustmentService.fetchAdjustments().then(setAdjustments);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !product_id || !quantity) return;

    try {
      await inventoryAdjustmentService.createAdjustment({
        user_id: user.id,
        product_id,
        adjustment_type: type,
        quantity: Number(quantity),
        reason
      });
      setProductId("");
      setQuantity("");
      setType("add");
      setReason("");
      toast({ title: "Inventory adjustment logged" });
      inventoryAdjustmentService.fetchAdjustments().then(setAdjustments);
    } catch {
      toast({ title: "Error logging adjustment", variant: "destructive" });
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Log Inventory Adjustment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              placeholder="Product ID"
              value={product_id}
              onChange={e => setProductId(e.target.value)}
              required
            />
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="border rounded px-2 py-1"
              required
            >
              <option value="add">Add</option>
              <option value="remove">Remove</option>
            </select>
            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="1"
              required
            />
            <Input
              placeholder="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <Button type="submit">Log Adjustment</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          {adjustments.length === 0 ? (
            <div>No recent adjustments.</div>
          ) : (
            <ul>
              {adjustments.slice(0, 5).map(adj => (
                <li key={adj.id}>
                  {adj.product_id} | <b>{adj.adjustment_type}</b> | Qty: {adj.quantity} | {adj.reason}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
