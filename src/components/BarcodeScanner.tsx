
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scan, Search, Package, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  minStock: number;
  price: number;
  category: string;
}

const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = localStorage.getItem('bepawa_products') || '[]';
    setProducts(JSON.parse(storedProducts));
  }, []);

  const handleScan = (code: string) => {
    const product = products.find(p => p.barcode === code);
    if (product) {
      setFoundProduct(product);
      toast({
        title: "Product Found!",
        description: `${product.name} - Stock: ${product.stock}`,
      });
    } else {
      toast({
        title: "Product Not Found",
        description: "No product found with this barcode",
        variant: "destructive",
      });
    }
    setIsScanning(false);
  };

  const simulateBarcodeScan = () => {
    // Simulate barcode scanning with sample codes
    const sampleBarcodes = ['1234567890123', '9876543210987', '5555555555555'];
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    setScannedCode(randomBarcode);
    handleScan(randomBarcode);
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter barcode manually or scan"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
            />
            <Button onClick={() => handleScan(scannedCode)} disabled={!scannedCode}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <Button 
            onClick={simulateBarcodeScan}
            className="w-full"
            variant={isScanning ? "destructive" : "default"}
          >
            <Scan className="h-4 w-4 mr-2" />
            {isScanning ? "Stop Scanning" : "Start Barcode Scan (Demo)"}
          </Button>

          {foundProduct && (
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold text-lg">{foundProduct.name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <p>Stock: <span className="font-medium">{foundProduct.stock}</span></p>
                <p>Price: <span className="font-medium">TZS {foundProduct.price.toLocaleString()}</span></p>
                <p>Category: <span className="font-medium">{foundProduct.category}</span></p>
                <p>Barcode: <span className="font-medium">{foundProduct.barcode}</span></p>
              </div>
              {foundProduct.stock <= foundProduct.minStock && (
                <Badge variant="destructive" className="mt-2">
                  Low Stock Alert
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg bg-orange-50">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">Current: {product.stock} | Min: {product.minStock}</p>
                  </div>
                  <Button size="sm">
                    <Package className="h-4 w-4 mr-1" />
                    Reorder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarcodeScanner;
