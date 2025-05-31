
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
}

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Load products from localStorage or initialize with sample data
    const storedProducts = localStorage.getItem('bepawa_products');
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    } else {
      // Initialize with sample products
      const sampleProducts: Product[] = [
        {
          id: "1",
          name: "Paracetamol 500mg",
          category: "painkillers",
          price: 150,
          stock: 500,
          description: "Effective pain relief and fever reducer",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
        },
        {
          id: "2",
          name: "Amoxicillin 250mg",
          category: "antibiotics",
          price: 300,
          stock: 200,
          description: "Broad-spectrum antibiotic capsules",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
        },
        {
          id: "3",
          name: "Vitamin C Tablets",
          category: "vitamins",
          price: 500,
          stock: 150,
          description: "Immune system support supplement",
          image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400"
        },
        {
          id: "4",
          name: "Blood Pressure Monitor",
          category: "equipment",
          price: 3500,
          stock: 25,
          description: "Digital blood pressure monitoring device",
          image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400"
        },
        {
          id: "5",
          name: "Disposable Syringes (10ml)",
          category: "supplies",
          price: 50,
          stock: 1000,
          description: "Sterile disposable syringes pack of 10",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
        },
        {
          id: "6",
          name: "Hand Sanitizer 500ml",
          category: "hygiene",
          price: 200,
          stock: 300,
          description: "70% alcohol hand sanitizer",
          image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
        }
      ];
      
      localStorage.setItem('bepawa_products', JSON.stringify(sampleProducts));
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
    }
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const addToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    const cartKey = `bepawa_cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "painkillers", label: "Pain Killers" },
    { value: "antibiotics", label: "Antibiotics" },
    { value: "vitamins", label: "Vitamins" },
    { value: "equipment", label: "Medical Equipment" },
    { value: "supplies", label: "Medical Supplies" },
    { value: "hygiene", label: "Hygiene Products" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Products Catalog</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0 || user?.role !== 'pharmacy'}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
