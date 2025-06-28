
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  CreditCard, 
  Users, 
  ClipboardList, 
  FileText,
  Store,
  Settings
} from "lucide-react";

const businessToolsNavigation = [
  { name: "POS System", href: "/wholesale/business-tools/pos", icon: Store },
  { name: "Credit/CRM", href: "/wholesale/business-tools/credit", icon: CreditCard },
  { name: "Staff Management", href: "/wholesale/business-tools/staff", icon: Users },
  { name: "Inventory Adjustments", href: "/wholesale/business-tools/adjustments", icon: ClipboardList },
  { name: "Audit Trail", href: "/wholesale/business-tools/audit", icon: FileText },
];

export const BusinessToolsSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Business Tools</h2>
      </div>
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {businessToolsNavigation.map((item) => {
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
