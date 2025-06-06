
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  maxStock: number;
  buyPrice: number;
  sellPrice: number;
  supplier: string;
  expiryDate: string;
  lastOrdered: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

const WholesaleInventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Sample inventory data
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Paracetamol 500mg Tablets',
        category: 'Pain Relief',
        sku: 'PAR-500-100',
        stock: 5000,
        minStock: 1000,
        maxStock: 10000,
        buyPrice: 25,
        sellPrice: 35,
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-12-31',
        lastOrdered: '2024-05-15',
        status: 'in-stock'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg Capsules',
        category: 'Antibiotics',
        sku: 'AMX-250-50',
        stock: 800,
        minStock: 1000,
        maxStock: 5000,
        buyPrice: 45,
        sellPrice: 60,
        supplier: 'MediCorp International',
        expiryDate: '2025-08-15',
        lastOrdered: '2024-04-20',
        status: 'low-stock'
      },
      {
        id: '3',
        name: 'Insulin Injection 100IU/ml',
        category: 'Diabetes',
        sku: 'INS-100-10',
        stock: 0,
        minStock: 50,
        maxStock: 200,
        buyPrice: 120,
        sellPrice: 150,
        supplier: 'DiabetesCare Inc',
        expiryDate: '2024-09-30',
        lastOrdered: '2024-03-10',
        status: 'out-of-stock'
      },
      {
        id: '4',
        name: 'Cough Syrup 200ml',
        category: 'Respiratory',
        sku: 'COU-200-24',
        stock: 2400,
        minStock: 500,
        maxStock: 3000,
        buyPrice: 30,
        sellPrice: 40,
        supplier: 'RespiCare Ltd',
        expiryDate: '2025-03-20',
        lastOrdered: '2024-05-01',
        status: 'in-stock'
      },
      {
        id: '5',
        name: 'Vitamin C 1000mg',
        category: 'Vitamins',
        sku: 'VTC-1000-60',
        stock: 150,
        minStock: 200,
        maxStock: 1000,
        buyPrice: 15,
        sellPrice: 25,
        supplier: 'VitaHealth Co',
        expiryDate: '2024-06-30',
        lastOrdered: '2024-02-15',
        status: 'expired'
      }
    ];

    setProducts(sampleProducts);
  }, [user, navigate]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesTab = activeTab === "all" || product.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReorder = (productId: string) => {
    toast({
      title: "Reorder Initiated",
      description: "Purchase order has been created for this product.",
    });
  };

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.status === 'low-stock').length,
    outOfStock: products.filter(p => p.status === 'out-of-stock').length,
    expired: products.filter(p => p.status === 'expired').length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600 text-lg">Manage your wholesale product inventory</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-5 w-5 mr-2" />
              Import
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.lowStock}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.outOfStock}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-100">Expired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.expired}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">TZS {stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="in-stock">In Stock</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.stock.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Buy: TZS {product.buyPrice}</div>
                            <div className="text-sm text-green-600">Sell: TZS {product.sellPrice}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(product.status)}>
                              {product.status.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {(product.status === 'low-stock' || product.status === 'out-of-stock') && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleReorder(product.id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Reorder
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WholesaleInventory;
