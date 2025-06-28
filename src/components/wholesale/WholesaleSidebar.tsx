
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  CreditCard,
  UserPlus,
  ClipboardList,
  Settings,
  Store
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/wholesale", icon: LayoutDashboard },
  { name: "Inventory", href: "/wholesale/inventory", icon: Package },
  { name: "Orders", href: "/wholesale/orders", icon: ShoppingCart },
  { name: "Retailer Orders", href: "/wholesale/retailer-orders", icon: ClipboardList },
  { name: "Retailers", href: "/wholesale/retailers", icon: Users },
  { name: "Analytics", href: "/wholesale/analytics", icon: BarChart3 },
  { name: "Business Tools", href: "/wholesale/business-tools", icon: Store },
];

export const WholesaleSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Wholesale Dashboard</h2>
      </div>
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
