
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Package } from "lucide-react";
import { useCreatePurchaseOrder, useSuppliers, useProducts } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItem {
  id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

const CreatePurchaseOrderDialog = ({ open, onOpenChange }: CreatePurchaseOrderDialogProps) => {
  const [supplierId, setSupplierId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  const { data: suppliers = [] } = useSuppliers();
  const { data: products = [] } = useProducts();
  const createPurchaseOrder = useCreatePurchaseOrder();
  const { toast } = useToast();

  const addItem = () => {
    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      product_name: "",
      quantity: 1,
      unit_cost: 0,
      total_cost: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, updates: Partial<OrderItem>) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        if ('quantity' in updates || 'unit_cost' in updates) {
          updatedItem.total_cost = updatedItem.quantity * updatedItem.unit_cost;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateItem(itemId, {
        product_id: productId,
        product_name: product.name,
        unit_cost: product.buy_price,
        total_cost: items.find(i => i.id === itemId)?.quantity || 1 * product.buy_price
      });
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total_cost, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the purchase order.",
        variant: "destructive",
      });
      return;
    }

    const poNumber = `PO-${Date.now()}`;
    
    try {
      await createPurchaseOrder.mutateAsync({
        supplier_id: supplierId || undefined,
        po_number: poNumber,
        status: 'pending',
        total_amount: totalAmount,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: expectedDelivery || undefined,
        notes: notes || undefined,
      });

      // Reset form
      setSupplierId("");
      setExpectedDelivery("");
      setNotes("");
      setItems([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="expected_delivery">Expected Delivery</Label>
                  <Input
                    id="expected_delivery"
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order Items</CardTitle>
                <Button type="button" onClick={addItem} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No items added yet. Click "Add Item" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4">
                          <Label>Product</Label>
                          <Select 
                            value={item.product_id || ""} 
                            onValueChange={(value) => handleProductSelect(item.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - {product.sku}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {!item.product_id && (
                            <Input
                              placeholder="Or enter product name"
                              value={item.product_name}
                              onChange={(e) => updateItem(item.id, { product_name: e.target.value })}
                              className="mt-2"
                            />
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label>Unit Cost</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unit_cost}
                            onChange={(e) => updateItem(item.id, { unit_cost: parseFloat(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label>Total</Label>
                          <Input
                            value={`TZS ${item.total_cost.toLocaleString()}`}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>TZS {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPurchaseOrder.isPending || items.length === 0}>
              {createPurchaseOrder.isPending ? "Creating..." : "Create Purchase Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePurchaseOrderDialog;
