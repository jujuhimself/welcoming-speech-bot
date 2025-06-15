
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Package, Filter, Grid, List, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ProductFilters from "@/components/ProductFilters";
import ProductDetails from "@/components/ProductDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

// Product type matching Supabase schema
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  manufacturer?: string;
  dosage?: string;
  prescription?: boolean;
  // Supabase-specific fields
  sell_price?: number;
  status?: string;
}

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  // Remove all mock/localStorage sources!

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) {
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, category, stock, description, supplier, buy_price, sell_price, status, dosage, sku"
        )
        .eq("user_id", user.id)
        .order("name");

      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      // Map data for Product UI
      const mapped: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: Number(p.sell_price ?? 0),
        stock: p.stock,
        description: p.description ?? "",
        manufacturer: p.supplier ?? "",
        dosage: p.dosage ?? "",
        prescription: false, // Supabase schema does not provide directly; always false unless logic added
        image:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", // Placeholder; enhance after DB schema update
        status: p.status,
      }));
      setProducts(mapped);
      setFilteredProducts(mapped);
    };

    fetchProducts();

    // Wishlist stays in local storage, keyed by user
    const storedWishlist = localStorage.getItem(`bepawa_wishlist_${user?.id || "guest"}`);
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    else setWishlist([]);
  }, [user, toast]);

  // Filtering + sorting using same logic but on new state
  const handleFiltersChange = (filters: any) => {
    let filtered = products;

    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() ?? "").includes(filters.searchTerm.toLowerCase()) ||
        (product.manufacturer?.toLowerCase() ?? "").includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.selectedCategory && filters.selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === filters.selectedCategory);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }

    if (filters.stockFilter) {
      switch (filters.stockFilter) {
        case "in-stock":
          filtered = filtered.filter(product => product.stock > 10);
          break;
        case "low-stock":
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
          break;
        case "out-of-stock":
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

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
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || "[]");

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

  const toggleWishlist = (productId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(newWishlist);
    localStorage.setItem(`bepawa_wishlist_${user.id}`, JSON.stringify(newWishlist));
    toast({
      title: wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
      description: `Product ${wishlist.includes(productId) ? "removed from" : "added to"} your wishlist`,
    });
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const categories = Array.from(new Set(products.map(product => product.category))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Medical Products Catalog
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Browse our comprehensive selection of pharmaceutical products
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ProductFilters
            onFiltersChange={handleFiltersChange}
            categories={categories}
            totalProducts={filteredProducts.length}
          />
        </div>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No products found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 cursor-pointer ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardHeader className={`p-0 ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <div className="relative" onClick={() => openProductDetails(product)}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full object-cover rounded-t-lg ${
                        viewMode === "list"
                          ? "h-32 rounded-l-lg rounded-t-none"
                          : "h-48"
                      }`}
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock >= 10 && (
                      <Badge className="absolute top-3 right-3 bg-green-500">
                        In Stock
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        Out of Stock
                      </Badge>
                    )}
                    {product.prescription && (
                      <Badge className="absolute top-3 left-3 bg-orange-500">
                        Rx
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-3 right-3 bg-white/80 hover:bg-white"
                      onClick={e => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          wishlist.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className={`p-4 md:p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <CardTitle
                    className="text-lg md:text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => openProductDetails(product)}
                  >
                    {product.name}
                  </CardTitle>

                  {product.manufacturer && (
                    <p className="text-sm text-gray-500 mb-1">by {product.manufacturer}</p>
                  )}

                  {product.dosage && (
                    <p className="text-sm text-gray-600 mb-2">Dosage: {product.dosage}</p>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div
                    className={`flex justify-between items-center mb-4 ${
                      viewMode === "list" ? "flex-col items-start gap-2" : ""
                    }`}
                  >
                    <span className="text-2xl md:text-3xl font-bold text-blue-600">
                      TZS {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0 || user?.role !== "retail"}
                      className="flex-1 h-10 md:h-12 text-sm md:text-lg font-semibold"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openProductDetails(product)}
                      className="px-3"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Product Details Modal */}
        <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isInWishlist={wishlist.includes(selectedProduct.id)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Products;

