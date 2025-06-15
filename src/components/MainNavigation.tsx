
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { User, Settings, Home, FileText, Package, BarChart3, Truck, Users, Wrench, ShoppingCart, TestTube, Building, CreditCard, Calculator, Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navConfig: Record<string, { label: string; icon: React.ReactNode; href: string; group: string; }[]> = {
  admin: [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/admin", group: "General" },
    { label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, href: "/admin/analytics", group: "General" },
    { label: "Business Tools", icon: <Wrench className="w-4 h-4" />, href: "/business-tools", group: "Tools" },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings", group: "Account" },
  ],
  individual: [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/individual", group: "General" },
    { label: "Find Pharmacies", icon: <Building className="w-4 h-4" />, href: "/pharmacy-directory", group: "Pharmacy & Lab" },
    { label: "Find Labs", icon: <TestTube className="w-4 h-4" />, href: "/lab-directory", group: "Pharmacy & Lab" },
    { label: "My Prescriptions", icon: <FileText className="w-4 h-4" />, href: "/prescriptions", group: "Health" },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings", group: "Account" },
  ],
  retail: [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/pharmacy", group: "General" },
    { label: "Inventory", icon: <Package className="w-4 h-4" />, href: "/inventory-management", group: "Inventory" },
    { label: "Browse Products", icon: <Package className="w-4 h-4" />, href: "/products", group: "Inventory" },
    { label: "Wholesale Orders", icon: <Truck className="w-4 h-4" />, href: "/wholesale-ordering", group: "Orders" },
    { label: "Cart", icon: <ShoppingCart className="w-4 h-4" />, href: "/cart", group: "Orders" },
    { label: "Orders", icon: <FileText className="w-4 h-4" />, href: "/orders", group: "Orders" },
    { label: "Business Center", icon: <Calculator className="w-4 h-4" />, href: "/business-center", group: "Business" },
    { label: "Credit Request", icon: <CreditCard className="w-4 h-4" />, href: "/credit-request", group: "Business" },
    { label: "Business Tools", icon: <Wrench className="w-4 h-4" />, href: "/business-tools-retail", group: "Tools" },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings", group: "Account" },
  ],
  wholesale: [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/wholesale", group: "General" },
    { label: "Inventory", icon: <Package className="w-4 h-4" />, href: "/wholesale/inventory", group: "Business" },
    { label: "Orders", icon: <FileText className="w-4 h-4" />, href: "/wholesale/orders", group: "Business" },
    { label: "Retailer Orders", icon: <Users className="w-4 h-4" />, href: "/wholesale/retailer-orders", group: "Business" },
    { label: "Purchase Orders", icon: <FileText className="w-4 h-4" />, href: "/wholesale/purchase-orders", group: "Business" },
    { label: "Retailers", icon: <Users className="w-4 h-4" />, href: "/wholesale/retailers", group: "Business" },
    { label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, href: "/wholesale/analytics", group: "Analytics" },
    { label: "Business Tools", icon: <Wrench className="w-4 h-4" />, href: "/wholesale/business-tools", group: "Tools" },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings", group: "Account" },
  ],
  lab: [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/lab", group: "General" },
    { label: "Test Catalog", icon: <TestTube className="w-4 h-4" />, href: "/lab/test-catalog", group: "Tests" },
    { label: "Business Tools", icon: <Wrench className="w-4 h-4" />, href: "/business-tools", group: "Tools" },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings", group: "Account" },
  ],
};

export const MainNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role ?? "retail";
  const menuItems = navConfig[role] ?? navConfig["retail"];

  // Group by section
  const groups = menuItems.reduce<Record<string, typeof menuItems>>( (acc, item) => {
      acc[item.group] ||= [];
      acc[item.group].push(item);
      return acc;
  }, {});

  return (
    <nav className="hidden md:flex items-center space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          {Object.entries(groups).map(([groupLabel, items]) => (
            <NavigationMenuItem key={groupLabel}>
              <NavigationMenuTrigger className="capitalize text-sm font-medium">
                {groupLabel}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-[100] p-3 min-w-[250px] bg-white rounded-lg shadow-lg border">
                <div className="grid gap-1">
                  {items.map((item) => (
                    <NavigationMenuLink asChild key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-blue-50 transition-colors text-gray-700 text-sm",
                          location.pathname === item.href && "bg-blue-100 text-blue-900 font-medium"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default MainNavigation;
