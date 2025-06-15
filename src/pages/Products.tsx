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
import ProductList from "@/components/ProductList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput } from "@/utils/security"; 
import { logError } from "@/utils/logger";

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
      try {
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
          logError(error, "Supabase fetch products error");
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
      } catch (err) {
        logError(err, "Unexpected error fetching products");
        toast({
          title: "Unexpected error",
          description: "Failed to load products.",
          variant: "destructive",
        });
      }
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
      const cleanTerm = sanitizeInput(filters.searchTerm);
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(cleanTerm.toLowerCase()) ||
        (product.description?.toLowerCase() ?? "").includes(cleanTerm.toLowerCase()) ||
        (product.manufacturer?.toLowerCase() ?? "").includes(cleanTerm.toLowerCase())
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
          <ProductList
            products={filteredProducts}
            viewMode={viewMode}
            wishlist={wishlist}
            onAddToCart={(product, e) => addToCart(product)}
            onToggleWishlist={(id, e) => toggleWishlist(id)}
            onViewDetails={openProductDetails}
            userRole={user?.role}
          />
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
