
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Package, LogOut, User, Menu, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationCenter } from "./NotificationSystem";
import { GlobalSearch } from "./GlobalSearch";
import MainNavigation from "./MainNavigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "./MainSidebar";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { Badge } from "@/components/ui/badge";

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

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      admin: 'Administrator',
      individual: 'Patient',
      retail: 'Pharmacy',
      wholesale: 'Distributor',
      lab: 'Laboratory'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Mobile Sidebar */}
      <MainSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-2 rounded-lg shadow-sm">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">BEPAWA</span>
              <span className="text-xs text-gray-500 hidden sm:block">Healthcare Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <MainNavigation />

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Global Search - Desktop only */}
            {user && (
              <div className="hidden lg:block">
                <GlobalSearch />
              </div>
            )}

            {/* Notifications */}
            {user && <NotificationCenter />}

            {/* User Menu - Desktop */}
            {user && (
              <div className="hidden md:flex items-center space-x-3 border-l border-gray-200 pl-3">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {user?.name}
                    </p>
                    {!user.isApproved && user.role !== 'individual' && (
                      <Badge variant="outline" className="text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {getRoleDisplayName(user?.role)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Logout Button */}
            {user && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            )}

            {/* Mobile Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>

        {/* Breadcrumb navigation */}
        {user && <BreadcrumbNavigation />}
      </div>
    </nav>
  );
};

export default Navbar;
