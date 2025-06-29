import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Package, LogOut, User, Menu, Bell, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationCenter } from "./NotificationSystem";
import { GlobalSearch } from "./GlobalSearch";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavigationMenuConfig } from "@/utils/navigationConfig";

const ResponsiveNavigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navigationConfig = new NavigationMenuConfig(user?.role || 'individual');
  const menuGroups = navigationConfig.getMenuGroups();

  // Deduplicate groups by name
  const uniqueMenuGroups = menuGroups.filter((group, idx, arr) =>
    arr.findIndex(g => g.name === group.name) === idx
  );

  // DEBUG: Log the group structure
  console.log('NAV GROUPS', uniqueMenuGroups);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900">BEPAWA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {uniqueMenuGroups.map((group) => (
              <div key={group.name} className="relative group">
                <Button variant="ghost" className="font-medium">
                  {group.name}
                </Button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors text-gray-700 text-sm",
                          location.pathname === item.href && "bg-blue-100 text-blue-900 font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Global Search - Desktop only */}
            {user && (
              <div className="hidden md:block">
                <GlobalSearch />
              </div>
            )}

            {/* Notifications */}
            {user && <NotificationCenter />}

            {/* User Menu - Desktop */}
            {user && (
              <div className="hidden lg:flex items-center space-x-3 border-l border-gray-200 pl-3">
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

            {/* Logout Button - Desktop */}
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="hidden lg:flex hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </Button>
            )}

            {/* Unauthenticated Actions - Desktop */}
            {!user && (
              <div className="hidden lg:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Join Platform</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-1.5 rounded-md">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">BEPAWA</span>
                    </div>
                  </div>

                  {/* User Info - Mobile */}
                  {user && (
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            {!user.isApproved && user.role !== 'individual' && (
                              <Badge variant="outline" className="text-xs">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {getRoleDisplayName(user.role)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {uniqueMenuGroups.map((group) => (
                      <div key={group.name} className="mb-6">
                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {group.name}
                        </h3>
                        <div className="space-y-1">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium",
                                location.pathname === item.href 
                                  ? "bg-blue-100 text-blue-900 border border-blue-200" 
                                  : "text-gray-700"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Footer */}
                  {user && (
                    <div className="border-t p-4 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          // Navigate to settings or profile
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                  {!user && (
                    <div className="border-t p-4 space-y-2">
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/login');
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/register');
                        }}
                      >
                        Join Platform
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Breadcrumb navigation - Only on desktop */}
        {user && (
          <div className="hidden md:block">
            <BreadcrumbNavigation />
          </div>
        )}
      </div>
    </nav>
  );
};

export default ResponsiveNavigation;
