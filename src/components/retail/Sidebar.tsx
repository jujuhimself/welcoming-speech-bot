
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { list, plus, filePlus, fileMinus, users, calculator, folder } from "lucide-react";

const sidenav = [
  {
    title: "POS",
    url: "/business-tools-retail/pos",
    icon: list,
  },
  {
    title: "Inventory Forecast",
    url: "/business-tools-retail/forecast",
    icon: filePlus,
  },
  {
    title: "Inventory Adjustment",
    url: "/business-tools-retail/adjustment",
    icon: fileMinus,
  },
  {
    title: "CRM / Credit",
    url: "/business-tools-retail/credit",
    icon: users,
  },
  // More modules can go here
];

export function RetailSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Business Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidenav.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={url}>
                  <SidebarMenuButton asChild isActive={location.pathname === url}>
                    <Link to={url}>
                      <Icon className="w-4 h-4" />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
