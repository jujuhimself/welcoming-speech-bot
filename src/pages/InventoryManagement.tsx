
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  expiryDate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

const InventoryManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Sample inventory data
    const sampleInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        sku: 'MED-001',
        category: 'Pain Relief',
        quantity: 500,
        minStock: 100,
        maxStock: 1000,
        unitPrice: 50,
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-12-31',
        status: 'in-stock'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        sku: 'MED-002',
        category: 'Antibiotics',
        quantity: 25,
        minStock: 50,
        maxStock: 500,
        unitPrice: 120,
        supplier: 'MediSupply Co',
        expiryDate: '2024-08-15',
        status: 'low-stock'
      },
      {
        id: '3',
        name: 'Insulin Injection',
        sku: 'MED-003',
        category: 'Diabetes',
        quantity: 0,
        minStock: 20,
        maxStock: 200,
        unitPrice: 850,
        supplier: 'DiaCare Ltd',
        expiryDate: '2024-10-30',
        status: 'out-of-stock'
      },
      {
        id: '4',
        name: 'Vitamin C Tablets',
        sku: 'MED-004',
        category: 'Vitamins',
        quantity: 150,
        minStock: 50,
        maxStock: 300,
        unitPrice: 75,
        supplier: 'HealthSupp Inc',
        expiryDate: '2024-03-15',
        status: 'expired'
      }
    ];

    setInventory(sampleInventory);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock': return <TrendingUp className="h-4 w-4" />;
      case 'low-stock': return <AlertTriangle className="h-4 w-4" />;
      case 'out-of-stock': return <TrendingDown className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];

  const stats = {
    totalItems: inventory.length,
    inStock: inventory.filter(item => item.status === 'in-stock').length,
    lowStock: inventory.filter(item => item.status === 'low-stock').length,
    outOfStock: inventory.filter(item => item.status === 'out-of-stock').length,
    expired: inventory.filter(item => item.status === 'expired').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600 text-lg">Manage your medical inventory and stock levels</p>
          </div>
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.inStock}</div>
              <div className="text-sm text-gray-600">In Stock</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.lowStock}</div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.outOfStock}</div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.expired}</div>
              <div className="text-sm text-gray-600">Expired</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold">TZS {stats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Item</th>
                    <th className="text-left p-3">SKU</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Quantity</th>
                    <th className="text-left p-3">Min/Max</th>
                    <th className="text-left p-3">Unit Price</th>
                    <th className="text-left p-3">Expiry</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.supplier}</div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-sm">{item.sku}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">
                        <span className={`font-bold ${item.quantity <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {item.minStock} / {item.maxStock}
                      </td>
                      <td className="p-3">TZS {item.unitPrice.toLocaleString()}</td>
                      <td className="p-3 text-sm">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(item.status)}
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagement;
