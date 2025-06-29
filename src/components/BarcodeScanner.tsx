import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scan, Search, Package, AlertTriangle, Camera, CameraOff, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { inventoryService } from "@/services/inventoryService";
import { useAuth } from "@/contexts/AuthContext";
import QrReader from "react-qr-barcode-scanner";

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
  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const role = user?.role;
        const supaProducts = await inventoryService.getProducts(role);
        // Map to local Product interface
        setProducts(
          supaProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            barcode: p.sku || p.id,
            stock: p.stock,
            minStock: p.min_stock,
            price: p.sell_price || p.price || 0,
            category: p.category || "-"
          }))
        );
      } catch (err) {
        toast({
          title: "Error loading products",
          description: "Could not fetch inventory from Supabase.",
          variant: "destructive"
        });
      }
      setLoading(false);
    };
    fetchProducts();
  }, [user]);

  const handleScan = (code: string) => {
    // Prevent duplicate scans
    if (lastScanned === code) return;
    
    setLastScanned(code);
    setScannedCode(code);
    
    const product = products.find(p => p.barcode === code || p.id === code);
    if (product) {
      setFoundProduct(product);
      toast({
        title: "Product Found!",
        description: `${product.name} - Stock: ${product.stock}`,
      });
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found with barcode: ${code}`,
        variant: "destructive",
      });
    }
  };

  const handleCameraError = (error: any) => {
    console.error("Camera error:", error);
    setCameraError("Camera access denied or not available. Please check permissions.");
    setIsScanning(false);
  };

  const handleCameraStart = () => {
    setCameraError(null);
    setLastScanned(null);
    setIsScanning(true);
  };

  const handleCameraStop = () => {
    setIsScanning(false);
    setCameraError(null);
  };

  const simulateBarcodeScan = () => {
    if (products.length === 0) return;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    handleScan(randomProduct.barcode);
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
          {/* Camera Scanner */}
          {isScanning && (
            <div className="relative">
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <QrReader
                  onUpdate={(err, result) => {
                    if (result) {
                      handleScan(result.getText());
                    }
                    if (err) {
                      handleCameraError(err);
                    }
                  }}
                  onError={handleCameraError}
                  style={{ width: "100%", height: "300px" }}
                />
              </div>
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleCameraStop}
                >
                  <CameraOff className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">
                Point camera at barcode to scan
              </div>
            </div>
          )}

          {/* Camera Controls */}
          {!isScanning && (
            <div className="flex gap-2">
              <Button 
                onClick={handleCameraStart}
                className="flex-1"
                disabled={loading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera Scanner
              </Button>
              <Button 
                onClick={simulateBarcodeScan}
                variant="outline"
                disabled={loading || products.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Demo Scan
              </Button>
            </div>
          )}

          {/* Camera Error */}
          {cameraError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{cameraError}</p>
              <p className="text-red-600 text-xs mt-1">
                Try refreshing the page or check browser camera permissions.
              </p>
            </div>
          )}

          {/* Manual Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter barcode manually"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
            />
            <Button onClick={() => handleScan(scannedCode)} disabled={!scannedCode || loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-gray-500 py-4">Loading inventory...</div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center text-gray-500 py-4">No products found in inventory.</div>
          )}

          {/* Found Product */}
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

      {/* Low Stock Alerts */}
      {!loading && lowStockProducts.length > 0 && (
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
