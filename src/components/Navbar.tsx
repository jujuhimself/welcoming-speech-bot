
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingCart, User, Menu, X, CreditCard, BarChart3, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import NotificationCenter from "./NotificationCenter";

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
    <nav className="border-b bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to={user?.role === 'admin' ? '/admin' : '/pharmacy'} 
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl shadow-lg">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              BEPAWA
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block font-medium">Medical Supply Chain</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {user?.role === 'pharmacy' && (
            <>
              <Button variant="ghost" asChild className="text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/products" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </Link>
              </Button>
              <Button variant="ghost" asChild className="relative text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/cart" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/orders" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" asChild className="text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/credit-request" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit
                </Link>
              </Button>
            </>
          )}

          {user?.role === 'admin' && (
            <Button variant="ghost" asChild className="text-gray-700 hover:text-primary-700 hover:bg-primary-50">
              <Link to="/admin" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}

          {/* Notification Center */}
          <NotificationCenter />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200 hover:border-primary-300 hover:bg-primary-50">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-1 mr-2">
                  <User className="h-4 w-4 text-primary-700" />
                </div>
                <span className="font-medium text-gray-700">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg w-56 z-50">
              <div className="px-3 py-2 border-b">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {user?.role === 'admin' ? 'Administrator' : 'Pharmacy'}
                </Badge>
              </div>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md px-4 py-4 space-y-3">
          {user?.role === 'pharmacy' && (
            <>
              <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <Package className="h-5 w-5 mr-3" />
                  Products
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-primary-700 hover:bg-primary-50 relative">
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Cart
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-primary-700 hover:bg-primary-50">
                <Link to="/credit-request" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3" />
                  Credit Request
                </Link>
              </Button>
            </>
          )}
          
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-2 mr-3">
                <User className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <Button variant="ghost" asChild className="w-full justify-start text-gray-700 hover:text-primary-700 hover:bg-primary-50">
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                <User className="h-5 w-5 mr-3" />
                Profile Settings
              </Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
