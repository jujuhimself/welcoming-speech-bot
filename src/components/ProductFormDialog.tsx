import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "@/hooks/useInventory";
import { useAuth } from "@/contexts/AuthContext";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductFormDialog = ({ open, onOpenChange }: ProductFormDialogProps) => {
  const createProduct = useCreateProduct();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    description: "",
    stock: 0,
    min_stock: 0,
    max_stock: 0,
    buy_price: 0,
    sell_price: 0,
    supplier: "",
    expiry_date: "",
    batch_number: "",
    is_public_product: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProduct.mutateAsync({
        ...formData,
        price: formData.sell_price, // Add the missing price property
        status: 'in-stock' as const
      });
      
      setFormData({
        name: "",
        category: "",
        sku: "",
        description: "",
        stock: 0,
        min_stock: 0,
        max_stock: 0,
        buy_price: 0,
        sell_price: 0,
        supplier: "",
        expiry_date: "",
        batch_number: "",
        is_public_product: false
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="min_stock">Minimum Stock *</Label>
              <Input
                id="min_stock"
                type="number"
                min="0"
                value={formData.min_stock}
                onChange={(e) => handleChange('min_stock', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="max_stock">Maximum Stock</Label>
              <Input
                id="max_stock"
                type="number"
                min="0"
                value={formData.max_stock}
                onChange={(e) => handleChange('max_stock', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="batch_number">Batch Number</Label>
              <Input
                id="batch_number"
                value={formData.batch_number}
                onChange={(e) => handleChange('batch_number', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="buy_price">Buy Price (TZS) *</Label>
              <Input
                id="buy_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.buy_price}
                onChange={(e) => handleChange('buy_price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="sell_price">Sell Price (TZS) *</Label>
              <Input
                id="sell_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.sell_price}
                onChange={(e) => handleChange('sell_price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleChange('expiry_date', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_public_product"
              type="checkbox"
              checked={formData.is_public_product}
              onChange={e => handleChange('is_public_product', e.target.checked)}
            />
            <Label htmlFor="is_public_product">
              Visible to Individual Users (Public Product)
            </Label>
          </div>
          {/* Helper note for wholesalers */}
          {user?.role === 'wholesale' && (
            <div className="text-xs text-muted-foreground pl-6 pb-2">
              Note: For wholesalers, public products are visible to retailers, not individuals.
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending}>
              {createProduct.isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
