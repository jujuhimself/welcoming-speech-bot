
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Filter, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PublicProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  pharmacy_name: string;
  pharmacy_id: string;
  manufacturer: string;
  requires_prescription: boolean;
  image_url: string;
}

const PublicCatalog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PublicProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts();
    if (user) {
      loadUserCart();
      loadUserWishlist();
    }
  }, [user]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchPublicProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          category,
          sell_price,
          stock,
          manufacturer,
          requires_prescription,
          image_url,
          profiles!inner(pharmacy_name, id)
        `)
        .eq('is_public_product', true)
        .gt('stock', 0)
        .order('name');

      if (error) throw error;

      const formattedProducts = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        category: item.category,
        price: item.sell_price || 0,
        stock: item.stock,
        pharmacy_name: item.profiles?.pharmacy_name || "Unknown Pharmacy",
        pharmacy_id: item.profiles?.id || "",
        manufacturer: item.manufacturer || "",
        requires_prescription: item.requires_prescription || false,
        image_url: item.image_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
      }));

      setProducts(formattedProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(formattedProducts.map(p => p.category))];
      setCategories(uniqueCategories);

    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const loadUserCart = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('items')
        .eq('user_id', user.id)
        .eq('status', 'cart')
        .single();

      if (data && data.items) {
        setCartItems(data.items);
      }
    } catch (error) {
      console.log('No existing cart found');
    }
  };

  const loadUserWishlist = async () => {
    if (!user) return;
    
    const savedWishlist = localStorage.getItem(`bepawa_wishlist_${user.id}`);
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const addToCart = async (product: PublicProduct) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        pharmacy_id: product.pharmacy_id,
        pharmacy_name: product.pharmacy_name,
        manufacturer: product.manufacturer,
        category: product.category,
        image: product.image_url
      }];
    }

    setCartItems(updatedCart);

    // Save to Supabase
    try {
      await supabase
        .from('orders')
        .upsert({
          user_id: user.id,
          status: 'cart',
          items: updatedCart,
          total_amount: updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          order_number: `CART-${user.id}`,
          payment_status: 'unpaid'
        });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error: any) {
      console.error('Error saving to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to wishlist",
        variant: "destructive",
      });
      navigate('/login');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medicine Catalog</h1>
          <p className="text-gray-600 text-lg">Find and order medicines from verified pharmacies</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medicines, manufacturers, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {user && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart ({cartItems.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {product.requires_prescription && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Prescription Required
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500 mb-1">by {product.manufacturer}</p>
                  <p className="text-sm text-blue-600 mb-2">Available at {product.pharmacy_name}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      TZS {product.price.toLocaleString()}
                    </span>
                    <Badge variant={product.stock > 10 ? "default" : "secondary"}>
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
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

export default PublicCatalog;
