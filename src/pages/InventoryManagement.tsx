
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Edit, AlertTriangle, TrendingDown, TrendingUp, Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      stock: 45,
      reorderLevel: 50,
      price: 5000,
      cost: 3500,
      supplier: "PharmaCorp Ltd",
      expiryDate: "2025-06-15",
      batchNumber: "PC2024001",
      status: "low"
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      category: "Antibiotics",
      stock: 28,
      reorderLevel: 30,
      price: 15000,
      cost: 12000,
      supplier: "MediSupply Co",
      expiryDate: "2025-08-20",
      batchNumber: "AM2024002",
      status: "low"
    },
    {
      id: 3,
      name: "Vitamin C 1000mg",
      category: "Vitamins",
      stock: 180,
      reorderLevel: 100,
      price: 8000,
      cost: 5500,
      supplier: "HealthPlus Distributors",
      expiryDate: "2026-03-10",
      batchNumber: "VC2024003",
      status: "good"
    },
    {
      id: 4,
      name: "Insulin Pen",
      category: "Diabetes",
      stock: 12,
      reorderLevel: 20,
      price: 45000,
      cost: 35000,
      supplier: "DiabetCare Inc",
      expiryDate: "2025-12-01",
      batchNumber: "IN2024004",
      status: "critical"
    }
  ]);

  const categories = ["all", "Pain Relief", "Antibiotics", "Vitamins", "Diabetes", "Heart", "Blood Pressure"];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "low":
        return <Badge variant="secondary">Low Stock</Badge>;
      case "good":
        return <Badge variant="default">Good</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const lowStockItems = inventory.filter(item => item.stock <= item.reorderLevel);
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);
  const totalProfit = inventory.reduce((sum, item) => sum + (item.stock * (item.price - item.cost)), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600 text-lg">Manage your pharmacy inventory and stock levels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TZS {totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">TZS {totalProfit.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">All Inventory</TabsTrigger>
            <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setAddProductModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>TZS {item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditProduct(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Current stock: {item.stock} | Reorder level: {item.reorderLevel}
                        </p>
                        <p className="text-sm text-gray-500">Supplier: {item.supplier}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status)}
                        <Button size="sm">Reorder Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories by Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.slice(1).map((category, index) => {
                      const categoryItems = inventory.filter(item => item.category === category);
                      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.stock * item.cost), 0);
                      return (
                        <div key={category} className="flex justify-between">
                          <span>{category}</span>
                          <span className="font-medium">TZS {categoryValue.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Critical Stock:</span>
                      <span className="text-red-600 font-medium">
                        {inventory.filter(item => item.status === "critical").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low Stock:</span>
                      <span className="text-orange-600 font-medium">
                        {inventory.filter(item => item.status === "low").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Good Stock:</span>
                      <span className="text-green-600 font-medium">
                        {inventory.filter(item => item.status === "good").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Product Modal */}
        <Dialog open={addProductModal} onOpenChange={setAddProductModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Product Name" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Stock Quantity" type="number" />
                <Input placeholder="Reorder Level" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Cost Price" type="number" />
                <Input placeholder="Selling Price" type="number" />
              </div>
              <Input placeholder="Supplier" />
              <Input placeholder="Expiry Date" type="date" />
              <Input placeholder="Batch Number" />
              <div className="flex space-x-2">
                <Button className="flex-1">Add Product</Button>
                <Button variant="outline" onClick={() => setAddProductModal(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal */}
        <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product: {editProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input defaultValue={editProduct?.name} placeholder="Product Name" />
              <div className="grid grid-cols-2 gap-4">
                <Input defaultValue={editProduct?.stock} placeholder="Stock Quantity" type="number" />
                <Input defaultValue={editProduct?.reorderLevel} placeholder="Reorder Level" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input defaultValue={editProduct?.cost} placeholder="Cost Price" type="number" />
                <Input defaultValue={editProduct?.price} placeholder="Selling Price" type="number" />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">Update Product</Button>
                <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InventoryManagement;
