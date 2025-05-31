
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingCart, User, Menu, X, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'pharmacy') {
      const cart = JSON.parse(localStorage.getItem(`bepawa_cart_${user.id}`) || '[]');
      setCartCount(cart.length);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to={user?.role === 'admin' ? '/admin' : '/pharmacy'} 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Package className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-blue-900">BEPAWA</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Medical Supply Chain</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user?.role === 'pharmacy' && (
            <>
              <Button variant="ghost" asChild className="text-lg">
                <Link to="/products">Products</Link>
              </Button>
              <Button variant="ghost" asChild className="relative text-lg">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-2">Cart</span>
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-lg">
                <Link to="/orders">Orders</Link>
              </Button>
              <Button variant="ghost" asChild className="text-lg">
                <Link to="/credit-request">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit
                </Link>
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="text-lg">
                <User className="h-4 w-4 mr-2" />
                {user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="text-lg py-3">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-lg py-3">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-4">
          {user?.role === 'pharmacy' && (
            <>
              <Button variant="ghost" asChild className="w-full justify-start text-lg h-12">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                  <Package className="h-5 w-5 mr-3" />
                  Products
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start text-lg h-12 relative">
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Cart
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start text-lg h-12">
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start text-lg h-12">
                <Link to="/credit-request" onClick={() => setIsMobileMenuOpen(false)}>
                  <CreditCard className="h-5 w-5 mr-3" />
                  Credit Request
                </Link>
              </Button>
            </>
          )}
          
          <hr className="my-4" />
          
          <Button variant="ghost" asChild className="w-full justify-start text-lg h-12">
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <User className="h-5 w-5 mr-3" />
              Profile ({user?.name})
            </Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-lg h-12 text-red-600">
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
