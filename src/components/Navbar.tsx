
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Package, User, LogOut, Menu, X, Bell, Settings, Home, ShoppingCart, FileText, Users, BarChart3, Pill, TestTube, Building, UserCheck, CreditCard, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/");
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'admin': return '/admin';
      case 'individual': return '/individual';
      case 'retail': return '/pharmacy';
      case 'wholesale': return '/wholesale';
      case 'lab': return '/lab';
      default: return '/';
    }
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { href: getDashboardRoute(), label: 'Dashboard', icon: <Home className="h-4 w-4" /> }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...commonItems,
          { href: '/admin', label: 'Admin Panel', icon: <Settings className="h-4 w-4" /> },
          { href: '/business-tools', label: 'Business Tools', icon: <Wrench className="h-4 w-4" /> }
        ];
      
      case 'individual':
        return [
          ...commonItems,
          { href: '/pharmacy-directory', label: 'Find Pharmacies', icon: <Building className="h-4 w-4" /> },
          { href: '/lab-directory', label: 'Find Labs', icon: <TestTube className="h-4 w-4" /> },
          { href: '/prescriptions', label: 'My Prescriptions', icon: <FileText className="h-4 w-4" /> }
        ];
      
      case 'retail':
        return [
          ...commonItems,
          { href: '/inventory-management', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
          { href: '/products', label: 'Browse Products', icon: <Package className="h-4 w-4" /> },
          { href: '/cart', label: 'Cart', icon: <ShoppingCart className="h-4 w-4" /> },
          { href: '/orders', label: 'Orders', icon: <FileText className="h-4 w-4" /> },
          { href: '/credit-request', label: 'Credit Request', icon: <CreditCard className="h-4 w-4" /> },
          { href: '/business-tools', label: 'Business Tools', icon: <Wrench className="h-4 w-4" /> }
        ];
      
      case 'wholesale':
        return [
          ...commonItems,
          { href: '/wholesale/inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
          { href: '/wholesale/orders', label: 'Orders', icon: <FileText className="h-4 w-4" /> },
          { href: '/wholesale/retailers', label: 'Retailers', icon: <Users className="h-4 w-4" /> },
          { href: '/wholesale/analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
          { href: '/business-tools', label: 'Business Tools', icon: <Wrench className="h-4 w-4" /> }
        ];
      
      case 'lab':
        return [
          ...commonItems,
          { href: '/lab', label: 'Lab Dashboard', icon: <TestTube className="h-4 w-4" /> },
          { href: '/business-tools', label: 'Business Tools', icon: <Wrench className="h-4 w-4" /> }
        ];
      
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getDashboardRoute()} className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BEPAWA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>

            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
