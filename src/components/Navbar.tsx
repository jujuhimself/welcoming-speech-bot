
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Package, LogOut, User, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationCenter } from "./NotificationSystem";
import { GlobalSearch } from "./GlobalSearch";
import MainNavigation from "./MainNavigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "./MainSidebar";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";

// Navbar with new navigation menu + mobile sidebar drawer (hamburger)
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Mobile Sidebar */}
      <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BEPAWA</span>
          </Link>

          {/* Desktop Navigation (Dropdowns) */}
          <MainNavigation />

          {/* User menu + search + notifications */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden md:block">
                <GlobalSearch />
              </div>
            )}

            {/* Notifications */}
            {user && <NotificationCenter />}

            {/* User Menu */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            )}
            {/* Logout */}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
            {/* Hamburger Menu - for mobile only */}
            <SidebarTrigger
              className="md:hidden"
              onClick={() => setSidebarOpen((val) => !val)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SidebarTrigger>
          </div>
        </div>
        {/* Breadcrumb navigation always shown below nav */}
        <BreadcrumbNavigation />
      </div>
    </nav>
  );
};

export default Navbar;
