
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

const navigationItems = [
  {
    title: "POS System",
    href: "/business-tools-retail/pos",
    icon: ShoppingCart,
  },
  {
    title: "Staff Management",
    href: "/business-tools-retail/staff",
    icon: Users,
  },
  {
    title: "Inventory Management",
    href: "/business-tools-retail/inventory",
    icon: Package,
  },
  {
    title: "Purchase Orders",
    href: "/business-tools-retail/purchase-orders",
    icon: ShoppingBag,
  },
  {
    title: "Stock Alerts",
    href: "/business-tools-retail/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Forecasting",
    href: "/business-tools-retail/forecast",
    icon: TrendingUp,
  },
  {
    title: "Analytics",
    href: "/business-tools-retail/analytics",
    icon: BarChart3,
  },
];

export function RetailSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Retail Tools</h2>
        <p className="text-sm text-gray-600">Complete retail management</p>
      </div>
      <nav className="px-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
