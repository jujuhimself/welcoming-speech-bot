import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";
import PharmacyDashboard from "@/pages/PharmacyDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import CreditRequest from "@/pages/CreditRequest";
import CreditRequestManagement from "@/pages/CreditRequestManagement";
import PrescriptionManagement from "@/pages/PrescriptionManagement";
import NotFound from "@/pages/NotFound";
import BusinessTools from "@/pages/BusinessTools";
import BusinessCenter from "@/pages/BusinessCenter";
import WholesaleOrdering from "@/pages/WholesaleOrdering";
import RouteGuard from "@/components/RouteGuard";
import IndividualDashboard from "@/pages/IndividualDashboard";
import WholesaleDashboard from "@/pages/WholesaleDashboard";
import WholesaleInventory from "@/pages/WholesaleInventory";
import WholesaleOrders from "@/pages/WholesaleOrders";
import WholesaleRetailers from "@/pages/WholesaleRetailers";
import WholesaleAnalytics from "@/pages/WholesaleAnalytics";
import WholesaleRetailerOrders from "@/pages/WholesaleRetailerOrders";
import WholesalePurchaseOrders from "@/pages/WholesalePurchaseOrders";
import WholesaleBusinessTools from "@/pages/WholesaleBusinessTools";
import LabDashboard from "@/pages/LabDashboard";
import LabTestCatalog from "@/pages/LabTestCatalog";
import Pharmacies from "@/pages/Pharmacies";
import Prescriptions from "@/pages/Prescriptions";
import PharmacyDirectory from "@/pages/PharmacyDirectory";
import LabDirectory from "@/pages/LabDirectory";
import InventoryManagement from "@/pages/InventoryManagement";
import SystemSettings from "@/pages/SystemSettings";
import AdminAnalytics from "@/pages/AdminAnalytics";
import RetailBusinessTools from "@/pages/RetailBusinessTools";
import RetailPos from "@/pages/retail/RetailPos";
import RetailForecast from "@/pages/retail/RetailForecast";
import RetailAdjustment from "@/pages/retail/RetailAdjustment";
import RetailCredit from "@/pages/retail/RetailCredit";
import PurchaseOrdersPage from "@/pages/PurchaseOrders";
import SuppliersPage from "@/pages/Suppliers";
import InventoryReportsPage from "@/pages/InventoryReports";
import InventoryDashboardPage from "@/pages/InventoryDashboard";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import BarcodeManager from "@/components/inventory/BarcodeManager";
import InventoryWorkflow from "@/components/inventory/InventoryWorkflow";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth-callback" element={<AuthCallback />} />

      {/* Protected Dashboard Routes */}
      <Route path="/individual" element={
        <RouteGuard allowedRoles={['individual']}>
          <IndividualDashboard />
        </RouteGuard>
      } />

      <Route path="/pharmacy" element={
        <RouteGuard allowedRoles={['retail']} requireApproval={true}>
          <PharmacyDashboard />
        </RouteGuard>
      } />

      <Route path="/wholesale" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleDashboard />
        </RouteGuard>
      } />

      <Route path="/wholesale/inventory" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleInventory />
        </RouteGuard>
      } />

      <Route path="/wholesale/orders" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleOrders />
        </RouteGuard>
      } />

      <Route path="/wholesale/retailer-orders" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleRetailerOrders />
        </RouteGuard>
      } />

      <Route path="/wholesale/purchase-orders" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesalePurchaseOrders />
        </RouteGuard>
      } />

      <Route path="/wholesale/retailers" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleRetailers />
        </RouteGuard>
      } />

      <Route path="/wholesale/analytics" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleAnalytics />
        </RouteGuard>
      } />

      <Route path="/wholesale/business-tools" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval={true}>
          <WholesaleBusinessTools />
        </RouteGuard>
      } />

      <Route path="/lab" element={
        <RouteGuard allowedRoles={['lab']} requireApproval={true}>
          <LabDashboard />
        </RouteGuard>
      } />

      <Route path="/lab/test-catalog" element={
        <RouteGuard allowedRoles={['lab']} requireApproval={true}>
          <LabTestCatalog />
        </RouteGuard>
      } />

      <Route path="/admin" element={
        <RouteGuard allowedRoles={['admin']}>
          <AdminDashboard />
        </RouteGuard>
      } />

      <Route path="/admin/analytics" element={
        <RouteGuard allowedRoles={['admin']}>
          <AdminAnalytics />
        </RouteGuard>
      } />

      {/* Protected General Routes */}
      <Route path="/products" element={
        <RouteGuard>
          <Products />
        </RouteGuard>
      } />

      <Route path="/product/:id" element={
        <RouteGuard>
          <ProductDetail />
        </RouteGuard>
      } />

      <Route path="/cart" element={
        <RouteGuard>
          <Cart />
        </RouteGuard>
      } />

      <Route path="/orders" element={
        <RouteGuard>
          <Orders />
        </RouteGuard>
      } />

      <Route path="/pharmacies" element={
        <RouteGuard>
          <Pharmacies />
        </RouteGuard>
      } />

      <Route path="/pharmacy-directory" element={
        <RouteGuard>
          <PharmacyDirectory />
        </RouteGuard>
      } />

      <Route path="/lab-directory" element={
        <RouteGuard>
          <LabDirectory />
        </RouteGuard>
      } />

      <Route path="/inventory-management" element={
        <RouteGuard>
          <InventoryManagement />
        </RouteGuard>
      } />

      {/* Inventory Dashboard */}
      <Route 
        path="/inventory-dashboard" 
        element={
          <RouteGuard allowedRoles={['retail', 'wholesale']}>
            <InventoryDashboardPage />
          </RouteGuard>
        } 
      />

      <Route path="/prescriptions" element={
        <RouteGuard>
          <Prescriptions />
        </RouteGuard>
      } />

      <Route path="/prescription-management" element={
        <RouteGuard>
          <PrescriptionManagement />
        </RouteGuard>
      } />

      <Route path="/credit-request" element={
        <RouteGuard>
          <CreditRequest />
        </RouteGuard>
      } />

      <Route path="/credit-management" element={
        <RouteGuard>
          <CreditRequestManagement />
        </RouteGuard>
      } />

      <Route path="/business-tools" element={
        <RouteGuard>
          <BusinessTools />
        </RouteGuard>
      } />

      <Route path="/business-center" element={
        <RouteGuard>
          <BusinessCenter />
        </RouteGuard>
      } />

      <Route path="/wholesale-ordering" element={
        <RouteGuard>
          <WholesaleOrdering />
        </RouteGuard>
      } />

      <Route path="/settings" element={
        <RouteGuard>
          <SystemSettings />
        </RouteGuard>
      } />

      <Route path="/business-tools-retail" element={
        <RouteGuard allowedRoles={['retail']}>
          <RetailBusinessTools />
        </RouteGuard>
      }>
        <Route path="pos" element={<RetailPos />} />
        <Route path="forecast" element={<RetailForecast />} />
        <Route path="adjustment" element={<RetailAdjustment />} />
        <Route path="credit" element={<RetailCredit />} />
      </Route>

      {/* Purchase Orders */}
      <Route 
        path="/purchase-orders" 
        element={
          <RouteGuard allowedRoles={['retail', 'wholesale']}>
            <PurchaseOrdersPage />
          </RouteGuard>
        } 
      />
      
      {/* Suppliers */}
      <Route 
        path="/suppliers" 
        element={
          <RouteGuard allowedRoles={['retail', 'wholesale']}>
            <SuppliersPage />
          </RouteGuard>
        } 
      />
      
      {/* Inventory Reports */}
      <Route 
        path="/inventory-reports" 
        element={
          <RouteGuard allowedRoles={['retail', 'wholesale']}>
            <InventoryReportsPage />
          </RouteGuard>
        } 
      />

      {/* Catch-all not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
