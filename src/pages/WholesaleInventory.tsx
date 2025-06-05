
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  minStock: number;
  description: string;
  manufacturer: string;
}

const WholesaleInventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Load wholesale products
    const wholesaleProducts = JSON.parse(localStorage.getItem(`bepawa_wholesale_products_${user.id}`) || '[]');
    if (wholesaleProducts.length === 0) {
      // Initialize with sample products
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          category: 'Pain Relief',
          stock: 5000,
          price: 25000,
          minStock: 1000,
          description: 'Pain and fever relief tablets',
          manufacturer: 'PharmaCorp'
        },
        {
          id: '2',
          name: 'Amoxicillin 250mg',
          category: 'Antibiotics',
          stock: 800,
          price: 45000,
          minStock: 500,
          description: 'Antibiotic capsules',
          manufacturer: 'MediLab'
        },
        {
          id: '3',
          name: 'Insulin Injection',
          category: 'Diabetes',
          stock: 200,
          price: 120000,
          minStock: 100,
          description: 'Diabetes management injection',
          manufacturer: 'DiaCare'
        }
      ];
      localStorage.setItem(`bepawa_wholesale_products_${user.id}`, JSON.stringify(sampleProducts));
      setProducts(sampleProducts);
    } else {
      setProducts(wholesaleProducts);
    }
  }, [user, navigate]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p className="text-gray-600 text-lg">Manage your wholesale product catalog</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                TZS {products.reduce((sum, p) => sum + (p.stock * p.price), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lowStockProducts.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categories.length - 1}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products or manufacturers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Product Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-xl p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{product.name}</h3>
                          <Badge variant="secondary">{product.category}</Badge>
                          {product.stock <= product.minStock && (
                            <Badge variant="destructive">Low Stock</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <p className="text-sm text-gray-500">Manufacturer: {product.manufacturer}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Current Stock</p>
                            <p className="font-semibold">{product.stock.toLocaleString()} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Unit Price</p>
                            <p className="font-semibold">TZS {product.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Min Stock</p>
                            <p className="font-semibold">{product.minStock.toLocaleString()} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Value</p>
                            <p className="font-semibold">TZS {(product.stock * product.price).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WholesaleInventory;
