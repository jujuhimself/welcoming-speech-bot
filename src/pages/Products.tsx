
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
      // Initialize with realistic medical products
      const sampleProducts: Product[] = [
        {
          id: "1",
          name: "Paracetamol 500mg",
          category: "painkillers",
          price: 1500,
          stock: 500,
          description: "Effective pain relief and fever reducer - Pack of 20 tablets",
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
        },
        {
          id: "2",
          name: "Amoxicillin 250mg",
          category: "antibiotics",
          price: 5000,
          stock: 200,
          description: "Broad-spectrum antibiotic capsules - Pack of 21 capsules",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
        },
        {
          id: "3",
          name: "Latex Gloves (Box of 100)",
          category: "supplies",
          price: 15000,
          stock: 8,
          description: "Disposable latex examination gloves - Powder-free",
          image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
        },
        {
          id: "4",
          name: "Hand Sanitizer 500ml",
          category: "hygiene",
          price: 4500,
          stock: 150,
          description: "70% alcohol-based hand sanitizer with moisturizer",
          image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
        },
        {
          id: "5",
          name: "Surgical Face Masks (Box of 50)",
          category: "supplies",
          price: 10000,
          stock: 5,
          description: "3-layer disposable surgical face masks",
          image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"
        },
        {
          id: "6",
          name: "Digital Thermometer",
          category: "equipment",
          price: 12000,
          stock: 25,
          description: "Fast and accurate digital thermometer with LCD display",
          image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400"
        },
        {
          id: "7",
          name: "Multivitamin Tablets",
          category: "vitamins",
          price: 8000,
          stock: 100,
          description: "Complete multivitamin supplement - 30 tablets",
          image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400"
        },
        {
          id: "8",
          name: "Blood Pressure Monitor",
          category: "equipment",
          price: 85000,
          stock: 3,
          description: "Automatic digital blood pressure monitor with large display",
          image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical Products Catalog</h1>
          <p className="text-gray-600 text-lg">Browse our comprehensive selection of pharmaceutical products</p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[250px] h-12">
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
          <div className="text-center py-16">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No products found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.stock < 10 && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock > 0 && product.stock >= 10 && (
                      <Badge className="absolute top-3 right-3 bg-green-500">
                        In Stock
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      TZS {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0 || user?.role !== 'pharmacy'}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
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
