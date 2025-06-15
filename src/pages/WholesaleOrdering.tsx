import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, ShoppingCart, Search, Filter, Truck, Calendar, DollarSign } from "lucide-react";

const WholesaleOrdering = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const [wholesaleProducts] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg (Box of 100)",
      category: "Pain Relief",
      supplier: "PharmaCorp Ltd",
      unitPrice: 35000,
      minQuantity: 10,
      stock: 500,
      description: "Bulk pack paracetamol tablets",
      leadTime: "3-5 days"
    },
    {
      id: 2,
      name: "Amoxicillin 250mg (Box of 50)",
      category: "Antibiotics",
      supplier: "MediSupply Co",
      unitPrice: 120000,
      minQuantity: 5,
      stock: 200,
      description: "Antibiotic capsules in bulk",
      leadTime: "2-4 days"
    },
    {
      id: 3,
      name: "Vitamin C 1000mg (Bottle of 100)",
      category: "Vitamins",
      supplier: "HealthPlus Distributors",
      unitPrice: 55000,
      minQuantity: 20,
      stock: 300,
      description: "High potency vitamin C supplements",
      leadTime: "1-3 days"
    },
    {
      id: 4,
      name: "Insulin Pen (Pack of 5)",
      category: "Diabetes",
      supplier: "DiabetCare Inc",
      unitPrice: 350000,
      minQuantity: 2,
      stock: 50,
      description: "Pre-filled insulin pens",
      leadTime: "5-7 days"
    },
    {
      id: 5,
      name: "Blood Pressure Monitor (Professional)",
      category: "Medical Devices",
      supplier: "MedTech Solutions",
      unitPrice: 250000,
      minQuantity: 1,
      stock: 25,
      description: "Digital BP monitor for pharmacies",
      leadTime: "7-10 days"
    }
  ]);

  const [purchaseOrders] = useState([
    {
      id: "PO-001",
      supplier: "PharmaCorp Ltd",
      items: 5,
      total: 875000,
      date: "2024-06-01",
      status: "delivered",
      expectedDelivery: "2024-06-05"
    },
    {
      id: "PO-002",
      supplier: "MediSupply Co",
      items: 3,
      total: 600000,
      date: "2024-06-03",
      status: "in-transit",
      expectedDelivery: "2024-06-07"
    },
    {
      id: "PO-003",
      supplier: "HealthPlus Distributors",
      items: 8,
      total: 440000,
      date: "2024-06-05",
      status: "pending",
      expectedDelivery: "2024-06-08"
    }
  ]);

  const categories = ["all", "Pain Relief", "Antibiotics", "Vitamins", "Diabetes", "Medical Devices"];

  const filteredProducts = wholesaleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any, quantity: number) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + quantity}
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity}]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-transit': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Wholesale Ordering</h1>
          <p className="text-gray-600 text-lg">Order in bulk from trusted pharmaceutical wholesalers</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wholesaleProducts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cart.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Truck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchaseOrders.filter(po => po.status !== 'delivered').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TZS {cartTotal.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Catalog */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search wholesale products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge variant="secondary">{product.leadTime}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Supplier:</span>
                        <span className="text-sm font-medium">{product.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Unit Price:</span>
                        <span className="text-lg font-bold">TZS {product.unitPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min Quantity:</span>
                        <span className="text-sm font-medium">{product.minQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">In Stock:</span>
                        <span className="text-sm font-medium">{product.stock}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min={product.minQuantity}
                        max={product.stock}
                        defaultValue={product.minQuantity}
                        className="w-20"
                        id={`quantity-${product.id}`}
                      />
                      <Button 
                        onClick={() => {
                          const quantityInput = document.getElementById(`quantity-${product.id}`) as HTMLInputElement;
                          const quantity = parseInt(quantityInput.value) || product.minQuantity;
                          addToCart(product, quantity);
                        }}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Shopping Cart & Orders */}
          <div className="space-y-6">
            {/* Shopping Cart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shopping Cart ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span>{item.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Unit Price:</span>
                            <span>TZS {item.unitPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Subtotal:</span>
                            <span>TZS {(item.unitPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Total:</span>
                        <span className="text-xl font-bold">TZS {cartTotal.toLocaleString()}</span>
                      </div>
                      <Button className="w-full" disabled={cart.length === 0}>
                        Place Order
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Purchase Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{order.supplier}</div>
                        <div>{order.items} items • TZS {order.total.toLocaleString()}</div>
                        <div>Expected: {order.expectedDelivery}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesaleOrdering;
