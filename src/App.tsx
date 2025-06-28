
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import WholesaleDashboard from "./pages/WholesaleDashboard";
import WholesaleInventory from "./pages/WholesaleInventory";
import RetailDashboard from "./pages/RetailDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import LabDashboard from "./pages/LabDashboard";
import WholesaleBusinessTools from "./pages/WholesaleBusinessTools";
import RetailBusinessTools from "./pages/retail/RetailBusinessTools";
import RetailPos from "./pages/retail/RetailPos";
import WholesalePOS from "./pages/wholesale/WholesalePOS";
import WholesaleAdvancedPOS from "./pages/wholesale/WholesaleAdvancedPOS";
import WholesaleCreditCRM from "./pages/wholesale/WholesaleCreditCRM";
import WholesaleStaffManagement from "./pages/wholesale/WholesaleStaffManagement";
import WholesaleInventoryAdjustments from "./pages/wholesale/WholesaleInventoryAdjustments";
import WholesaleAuditTrail from "./pages/wholesale/WholesaleAuditTrail";
import RetailAdvancedPOS from "./pages/retail/RetailAdvancedPOS";
import RetailStaffManagement from "./pages/retail/RetailStaffManagement";
import RetailInventoryManagement from "./pages/retail/RetailInventoryManagement";
import RetailPurchaseOrders from "./pages/retail/RetailPurchaseOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Wholesale Routes */}
              <Route path="/wholesale/dashboard" element={<WholesaleDashboard />} />
              <Route path="/wholesale/inventory" element={<WholesaleInventory />} />
              <Route path="/wholesale/business-tools" element={<WholesaleBusinessTools />}>
                <Route path="pos" element={<WholesalePOS />} />
                <Route path="advanced-pos" element={<WholesaleAdvancedPOS />} />
                <Route path="credit-crm" element={<WholesaleCreditCRM />} />
                <Route path="staff" element={<WholesaleStaffManagement />} />
                <Route path="adjustments" element={<WholesaleInventoryAdjustments />} />
                <Route path="audit" element={<WholesaleAuditTrail />} />
              </Route>
              
              {/* Retail Routes */}
              <Route path="/retail/dashboard" element={<RetailDashboard />} />
              <Route path="/business-tools-retail" element={<RetailBusinessTools />}>
                <Route path="pos" element={<RetailAdvancedPOS />} />
                <Route path="staff" element={<RetailStaffManagement />} />
                <Route path="inventory" element={<RetailInventoryManagement />} />
                <Route path="purchase-orders" element={<RetailPurchaseOrders />} />
              </Route>
              
              {/* Pharmacy Routes */}
              <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
              
              {/* Lab Routes */}
              <Route path="/lab/dashboard" element={<LabDashboard />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
