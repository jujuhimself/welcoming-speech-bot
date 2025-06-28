
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  CreditCard,
  Users,
  Package,
  Shield,
  Building,
  Settings,
  BarChart3
} from "lucide-react";

const navigationItems = [
  {
    title: "Advanced POS",
    href: "/wholesale/business-tools/advanced-pos",
    icon: ShoppingCart,
  },
  {
    title: "Credit & CRM",
    href: "/wholesale/business-tools/credit-crm",
    icon: CreditCard,
  },
  {
    title: "Staff Management",
    href: "/wholesale/business-tools/staff",
    icon: Users,
  },
  {
    title: "Inventory Adjustments",
    href: "/wholesale/business-tools/adjustments",
    icon: Package,
  },
  {
    title: "Audit Trail",
    href: "/wholesale/business-tools/audit",
    icon: Shield,
  },
  {
    title: "Multi-Branch",
    href: "/wholesale/business-tools/branches",
    icon: Building,
  },
  {
    title: "Analytics",
    href: "/wholesale/business-tools/analytics",
    icon: BarChart3,
  },
];

export function BusinessToolsSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Business Tools</h2>
        <p className="text-sm text-gray-600">Wholesale management suite</p>
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
