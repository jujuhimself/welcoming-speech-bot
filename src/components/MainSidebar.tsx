
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Settings, FileText, Package, BarChart3, Truck, Users, Wrench, ShoppingCart, TestTube, Building, CreditCard, Calculator } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navConfig: Record<string, { label: string; icon: React.ReactNode; href: string; group: string; }[]> = {
  admin: [
    { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/admin", group: "General" },
    { label: "Admin Panel", icon: <Settings className="w-4 h-4" />, href: "/admin", group: "General" },
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

export const MainSidebar = ({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) => {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role ?? "retail";
  const menuItems = navConfig[role] ?? navConfig["retail"];
  const grouped = menuItems.reduce<Record<string, typeof menuItems>>( (acc, item) => {
    acc[item.group] ||= [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <Sidebar collapsible="offcanvas" className="md:hidden">
      <SidebarHeader className="py-4 px-4 border-b border-gray-100">
        <span className="text-lg font-semibold text-gray-900">Navigation</span>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(grouped).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel className="text-xs text-gray-500 uppercase mt-3 mb-1">
              {groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                      <Link
                        to={item.href}
                        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-blue-50 transition-colors text-base"
                        onClick={() => onOpenChange(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4 text-center">
        <span className="text-xs text-gray-400">BEPAWA © {new Date().getFullYear()}</span>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
