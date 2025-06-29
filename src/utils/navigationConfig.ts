import React from "react";
import { 
  Home, 
  Settings, 
  FileText, 
  Package, 
  BarChart3, 
  Truck, 
  Users, 
  Wrench, 
  ShoppingCart, 
  TestTube, 
  Building, 
  CreditCard, 
  Calculator,
  Calendar,
  Heart,
  Shield,
  Activity,
  Database,
  UserCheck,
  Eye,
} from "lucide-react";
import { FaCashRegister } from 'react-icons/fa';

export interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface NavigationGroup {
  name: string;
  items: NavigationItem[];
}

export class NavigationMenuConfig {
  private role: string;

  constructor(role: string) {
    this.role = role;
  }

  private getNavigationItems(): Record<string, NavigationItem[]> {
    return {
      admin: [
        { label: "Dashboard", icon: React.createElement(Home, { className: "w-4 h-4" }), href: "/admin" },
        { label: "User Management", icon: React.createElement(Users, { className: "w-4 h-4" }), href: "/admin/users" },
        { label: "System Monitoring", icon: React.createElement(Activity, { className: "w-4 h-4" }), href: "/admin/system-monitoring" },
        { label: "Audit Logs", icon: React.createElement(Eye, { className: "w-4 h-4" }), href: "/admin/audit-logs" },
        { label: "Settings", icon: React.createElement(Settings, { className: "w-4 h-4" }), href: "/settings" },
      ],
      individual: [
        { label: "Dashboard", icon: React.createElement(Home, { className: "w-4 h-4" }), href: "/individual" },
        { label: "Find Pharmacies", icon: React.createElement(Building, { className: "w-4 h-4" }), href: "/pharmacy-directory" },
        { label: "Find Labs", icon: React.createElement(TestTube, { className: "w-4 h-4" }), href: "/lab-directory" },
        { label: "My Prescriptions", icon: React.createElement(FileText, { className: "w-4 h-4" }), href: "/prescriptions" },
        { label: "Appointments", icon: React.createElement(Calendar, { className: "w-4 h-4" }), href: "/appointments" },
        { label: "Health Records", icon: React.createElement(Heart, { className: "w-4 h-4" }), href: "/health-records" },
        { label: "Settings", icon: React.createElement(Settings, { className: "w-4 h-4" }), href: "/settings" },
      ],
      retail: [
        { label: "Dashboard", icon: React.createElement(Home, { className: "w-4 h-4" }), href: "/pharmacy" },
        { label: "Inventory", icon: React.createElement(Package, { className: "w-4 h-4" }), href: "/inventory-management" },
        { label: "Browse Products", icon: React.createElement(Package, { className: "w-4 h-4" }), href: "/products" },
        { label: "Wholesale Orders", icon: React.createElement(Truck, { className: "w-4 h-4" }), href: "/wholesale-ordering" },
        { label: "Cart", icon: React.createElement(ShoppingCart, { className: "w-4 h-4" }), href: "/cart" },
        { label: "Orders", icon: React.createElement(FileText, { className: "w-4 h-4" }), href: "/orders" },
        { label: "Appointments", icon: React.createElement(Calendar, { className: "w-4 h-4" }), href: "/pharmacy/appointments" },
        { label: "Business Center", icon: React.createElement(Calculator, { className: "w-4 h-4" }), href: "/business-center" },
        { label: "Credit Request", icon: React.createElement(CreditCard, { className: "w-4 h-4" }), href: "/credit-request" },
        { label: "POS", icon: React.createElement(FaCashRegister, { size: 16 }), href: "/pos" },
        { label: "Business Operations Hub", icon: React.createElement(Wrench, { className: "w-4 h-4" }), href: "/business-tools" },
        { label: "Settings", icon: React.createElement(Settings, { className: "w-4 h-4" }), href: "/settings" },
      ],
      wholesale: [
        { label: "Dashboard", icon: React.createElement(Home, { className: "w-4 h-4" }), href: "/wholesale" },
        { label: "Inventory", icon: React.createElement(Package, { className: "w-4 h-4" }), href: "/wholesale/inventory" },
        { label: "Retailer Orders", icon: React.createElement(Users, { className: "w-4 h-4" }), href: "/wholesale/retailer-orders" },
        { label: "Purchase Orders", icon: React.createElement(FileText, { className: "w-4 h-4" }), href: "/wholesale/purchase-orders" },
        { label: "Retailers", icon: React.createElement(Users, { className: "w-4 h-4" }), href: "/wholesale/retailers" },
        { label: "POS", icon: React.createElement(FaCashRegister, { size: 16 }), href: "/pos" },
        { label: "Business Operations Hub", icon: React.createElement(Wrench, { className: "w-4 h-4" }), href: "/business-tools" },
        { label: "Settings", icon: React.createElement(Settings, { className: "w-4 h-4" }), href: "/settings" },
      ],
      lab: [
        { label: "Dashboard", icon: React.createElement(Home, { className: "w-4 h-4" }), href: "/lab" },
        { label: "Test Catalog", icon: React.createElement(TestTube, { className: "w-4 h-4" }), href: "/lab/test-catalog" },
        { label: "Lab Orders", icon: React.createElement(FileText, { className: "w-4 h-4" }), href: "/lab/orders" },
        { label: "Appointments", icon: React.createElement(Calendar, { className: "w-4 h-4" }), href: "/lab/appointments" },
        { label: "Results Management", icon: React.createElement(Database, { className: "w-4 h-4" }), href: "/lab/results" },
        { label: "Quality Control", icon: React.createElement(Shield, { className: "w-4 h-4" }), href: "/lab/quality-control" },
        { label: "Business Tools", icon: React.createElement(Wrench, { className: "w-4 h-4" }), href: "/business-tools" },
        { label: "Settings", icon: React.createElement(Settings, { className: "w-4 h-4" }), href: "/settings" },
      ],
    };
  }

  private groupItemsByCategory(items: NavigationItem[]): NavigationGroup[] {
    // Merge all items with the same group name into a single group
    const groupedItems: Record<string, NavigationItem[]> = {};
    const groupMapping: Record<string, string> = {
      "Dashboard": "General",
      "Analytics": "General",
      "System Monitoring": "Administration",
      "User Management": "Administration", 
      "Audit Logs": "Administration",
      "Inventory": "Inventory",
      "Browse Products": "Inventory", 
      "Wholesale Orders": "Orders",
      "Cart": "Orders",
      "Orders": "Orders",
      "Lab Orders": "Orders",
      "Retailer Orders": "Orders",
      "Purchase Orders": "Orders",
      "Business Center": "Business",
      "Business Operations Hub": "Business",
      "Credit Request": "Business",
      "Retailers": "Business",
      "Find Pharmacies": "Directory",
      "Find Labs": "Directory",
      "My Prescriptions": "Health",
      "Appointments": "Health",
      "Health Records": "Health",
      "Test Catalog": "Lab Services",
      "Results Management": "Lab Services",
      "Quality Control": "Lab Services",
      "POS": "General",
      "Settings": "Account",
    };

    items.forEach(item => {
      const groupName = groupMapping[item.label] || "Other";
      if (!groupedItems[groupName]) {
        groupedItems[groupName] = [];
      }
      groupedItems[groupName].push(item);
    });

    const groupOrder = [
      "General", 
      "Administration",
      "Inventory", 
      "Orders", 
      "Business", 
      "Directory", 
      "Health", 
      "Lab Services", 
      "Tools", 
      "Account", 
      "Other"
    ];
    
    // Only one group per name, with all items merged
    return groupOrder
      .filter(groupName => groupedItems[groupName])
      .map(groupName => ({
        name: groupName,
        items: groupedItems[groupName]
      }));
  }

  getMenuGroups(): NavigationGroup[] {
    const allItems = this.getNavigationItems();
    const roleItems = allItems[this.role] || allItems['retail'];
    return this.groupItemsByCategory(roleItems);
  }

  getMenuItems(): NavigationItem[] {
    const allItems = this.getNavigationItems();
    return allItems[this.role] || allItems['retail'];
  }
}
