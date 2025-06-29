import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/RouteGuard";
import StaffManagement from '@/components/retail/StaffManagement';
import { useAuth } from "@/contexts/AuthContext";

// Index and Auth
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";

// Individual Pages
import IndividualDashboard from "@/pages/IndividualDashboard";
import Appointments from "@/pages/Appointments";
import HealthRecords from "@/pages/HealthRecords";
import Prescriptions from "@/pages/Prescriptions";
import PrescriptionManagement from "@/pages/PrescriptionManagement";
import PharmacyDirectory from "@/pages/PharmacyDirectory";
import LabDirectory from "@/pages/LabDirectory";
import BrowseProducts from "@/pages/BrowseProducts";
import MyOrders from "@/pages/MyOrders";
import Catalog from "@/pages/Catalog";
import OrderHistory from "@/pages/OrderHistory";

// Pharmacy/Retail Pages
import PharmacyDashboard from "@/pages/PharmacyDashboard";
import PharmacyAppointments from "@/pages/pharmacy/PharmacyAppointments";
import InventoryManagement from "@/pages/InventoryManagement";
import InventoryDashboard from "@/pages/InventoryDashboard";
import InventoryReports from "@/pages/InventoryReports";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Orders from "@/pages/Orders";
import Cart from "@/pages/Cart";
import WholesaleOrdering from "@/pages/WholesaleOrdering";
import BusinessCenter from "@/pages/BusinessCenter";
import CreditRequest from "@/pages/CreditRequest";
import CreditRequestManagement from "@/pages/CreditRequestManagement";
import Suppliers from "@/pages/Suppliers";
import PurchaseOrders from "@/pages/PurchaseOrders";
import RetailBusinessTools from "@/pages/retail/RetailBusinessTools";
import RetailAuditLog from "@/pages/retail/RetailAuditLog";
import RetailAdjustment from "@/pages/retail/RetailAdjustment";
import RetailCredit from "@/pages/retail/RetailCredit";
import RetailForecast from "@/pages/retail/RetailForecast";
import RetailPos from "@/pages/retail/RetailPos";
import RetailReporting from "@/pages/retail/RetailReporting";
import CreditCRMManagement from '@/pages/CreditCRMManagement';
import InventoryAdjustments from '@/pages/InventoryAdjustments';
import AuditReports from '@/pages/AuditReports';

// Wholesale Pages
import WholesaleDashboard from "@/pages/WholesaleDashboard";
import WholesaleInventory from "@/pages/WholesaleInventory";
import WholesaleOrders from "@/pages/WholesaleOrders";
import WholesaleRetailerOrders from "@/pages/WholesaleRetailerOrders";
import WholesalePurchaseOrders from "@/pages/WholesalePurchaseOrders";
import WholesaleRetailers from "@/pages/WholesaleRetailers";
import WholesaleBusinessTools from "@/pages/WholesaleBusinessTools";
import WholesalePOS from "@/pages/wholesale/WholesalePOS";
import WholesaleCreditCRM from "@/pages/wholesale/WholesaleCreditCRM";
import WholesaleStaffManagement from "@/pages/wholesale/WholesaleStaffManagement";
import WholesaleAdjustments from "@/pages/wholesale/WholesaleAdjustments";
import WholesaleAuditTrail from "@/pages/wholesale/WholesaleAuditTrail";

// Lab Pages
import LabDashboard from "@/pages/LabDashboard";
import LabTestCatalog from "@/pages/LabTestCatalog";
import LabOrders from "@/pages/lab/LabOrders";
import LabAppointments from "@/pages/lab/LabAppointments";
import LabResults from "@/pages/lab/LabResults";
import LabQualityControl from "@/pages/lab/LabQualityControl";

// Admin Pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSystemMonitoring from "@/pages/admin/AdminSystemMonitoring";

// Common Pages
import BusinessTools from "@/pages/BusinessTools";
import SystemSettings from "@/pages/SystemSettings";
import Pharmacies from "@/pages/Pharmacies";
import NotFound from "@/pages/NotFound";
import Analytics from "@/pages/Analytics";

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/catalog" element={<Catalog />} />

      {/* Individual User Routes */}
      <Route path="/individual" element={
        <RouteGuard allowedRoles={['individual']}>
          <IndividualDashboard />
        </RouteGuard>
      } />
      <Route path="/appointments" element={
        <RouteGuard allowedRoles={['individual']}>
          <Appointments />
        </RouteGuard>
      } />
      <Route path="/health-records" element={
        <RouteGuard allowedRoles={['individual']}>
          <HealthRecords />
        </RouteGuard>
      } />
      <Route path="/prescriptions" element={
        <RouteGuard allowedRoles={['individual']}>
          <Prescriptions />
        </RouteGuard>
      } />
      <Route path="/prescription-management" element={
        <RouteGuard allowedRoles={['individual', 'retail']}>
          <PrescriptionManagement />
        </RouteGuard>
      } />
      <Route path="/pharmacy-directory" element={
        <RouteGuard allowedRoles={['individual']}>
          <PharmacyDirectory />
        </RouteGuard>
      } />
      <Route path="/lab-directory" element={
        <RouteGuard allowedRoles={['individual']}>
          <LabDirectory />
        </RouteGuard>
      } />
      <Route path="/browse-products" element={
        <RouteGuard allowedRoles={['individual']}>
          <BrowseProducts />
        </RouteGuard>
      } />
      <Route path="/my-orders" element={
        <RouteGuard allowedRoles={['individual']}>
          <MyOrders />
        </RouteGuard>
      } />
      <Route path="/order-history" element={
        <RouteGuard allowedRoles={['individual']}>
          <OrderHistory />
        </RouteGuard>
      } />

      {/* Pharmacy/Retail Routes */}
      <Route path="/pharmacy" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <PharmacyDashboard />
        </RouteGuard>
      } />
      <Route path="/pharmacy/appointments" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <PharmacyAppointments />
        </RouteGuard>
      } />
      <Route path="/inventory-management" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <InventoryManagement />
        </RouteGuard>
      } />
      <Route path="/inventory-dashboard" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <InventoryDashboard />
        </RouteGuard>
      } />
      <Route path="/inventory-reports" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <InventoryReports />
        </RouteGuard>
      } />
      <Route path="/products" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <Products />
        </RouteGuard>
      } />
      <Route path="/products/:id" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <ProductDetail />
        </RouteGuard>
      } />
      <Route path="/orders" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <Orders />
        </RouteGuard>
      } />
      <Route path="/cart" element={
        <RouteGuard allowedRoles={['retail', 'individual']} requireApproval>
          <Cart />
        </RouteGuard>
      } />
      <Route path="/wholesale-ordering" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <WholesaleOrdering />
        </RouteGuard>
      } />
      <Route path="/business-center" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <BusinessCenter />
        </RouteGuard>
      } />
      <Route path="/credit-request" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <CreditRequest />
        </RouteGuard>
      } />
      <Route path="/credit-request-management" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <CreditRequestManagement />
        </RouteGuard>
      } />
      <Route path="/suppliers" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <Suppliers />
        </RouteGuard>
      } />
      <Route path="/purchase-orders" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <PurchaseOrders />
        </RouteGuard>
      } />
      <Route path="/business-tools-retail" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailBusinessTools />
        </RouteGuard>
      } />
      <Route path="/credit" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <CreditCRMManagement />
        </RouteGuard>
      } />

      {/* Retail Business Tools Sub-routes */}
      <Route path="/retail/audit-log" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailAuditLog />
        </RouteGuard>
      } />
      <Route path="/retail/adjustment" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailAdjustment />
        </RouteGuard>
      } />
      <Route path="/retail/credit" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailCredit />
        </RouteGuard>
      } />
      <Route path="/retail/forecast" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailForecast />
        </RouteGuard>
      } />
      <Route path="/retail/pos" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailPos />
        </RouteGuard>
      } />
      <Route path="/retail/reporting" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <RetailReporting />
        </RouteGuard>
      } />

      {/* Wholesale Routes */}
      <Route path="/wholesale" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleDashboard />
        </RouteGuard>
      } />
      <Route path="/wholesale/inventory" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleInventory />
        </RouteGuard>
      } />
      <Route path="/wholesale/orders" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleOrders />
        </RouteGuard>
      } />
      <Route path="/wholesale/retailer-orders" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleRetailerOrders />
        </RouteGuard>
      } />
      <Route path="/wholesale/purchase-orders" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesalePurchaseOrders />
        </RouteGuard>
      } />
      <Route path="/wholesale/retailers" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleRetailers />
        </RouteGuard>
      } />
      <Route path="/wholesale/business-tools" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleBusinessTools />
        </RouteGuard>
      } />
      <Route path="/wholesale/business-tools/pos" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesalePOS />
        </RouteGuard>
      } />
      <Route path="/wholesale/business-tools/credit" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleCreditCRM />
        </RouteGuard>
      } />
      <Route path="/wholesale/business-tools/staff" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleStaffManagement />
        </RouteGuard>
      } />
      <Route path="/wholesale/business-tools/adjustments" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleAdjustments />
        </RouteGuard>
      } />
      <Route path="/wholesale/business-tools/audit" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleAuditTrail />
        </RouteGuard>
      } />
      {/* Direct routes for wholesale quick actions */}
      <Route path="/wholesale/staff" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleStaffManagement />
        </RouteGuard>
      } />
      <Route path="/wholesale/credit-crm" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleCreditCRM />
        </RouteGuard>
      } />
      <Route path="/wholesale/adjustments" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleAdjustments />
        </RouteGuard>
      } />
      <Route path="/wholesale/audit-reports" element={
        <RouteGuard allowedRoles={['wholesale']} requireApproval>
          <WholesaleAuditTrail />
        </RouteGuard>
      } />

      {/* Lab Routes */}
      <Route path="/lab" element={
        <RouteGuard allowedRoles={['lab']} requireApproval>
          <LabDashboard />
        </RouteGuard>
      } />
      <Route path="/lab/test-catalog" element={
        <RouteGuard allowedRoles={['lab']} requireApproval>
          <LabTestCatalog />
        </RouteGuard>
      } />
      <Route path="/lab/orders" element={
        <RouteGuard allowedRoles={['lab']} requireApproval>
          <LabOrders />
        </RouteGuard>
      } />
      <Route path="/lab/appointments" element={
        <RouteGuard allowedRoles={['lab']} requireApproval>
          <LabAppointments />
        </RouteGuard>
      } />
      <Route path="/lab/results" element={
        <RouteGuard allowedRoles={['lab']} requireApproval>
          <LabResults />
        </RouteGuard>
      } />
      <Route path="/lab/quality-control" element={
        <RouteGuard allowedRoles={['lab']} requireApproval>
          <LabQualityControl />
        </RouteGuard>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <RouteGuard allowedRoles={['admin']}>
          <AdminDashboard />
        </RouteGuard>
      } />
      <Route path="/admin/system-monitoring" element={
        <RouteGuard allowedRoles={['admin']}>
          <AdminSystemMonitoring />
        </RouteGuard>
      } />
      <Route path="/admin/users" element={
        <RouteGuard allowedRoles={['admin']}>
          <AdminDashboard />
        </RouteGuard>
      } />
      <Route path="/admin/audit-logs" element={
        <RouteGuard allowedRoles={['admin']}>
          <AdminDashboard />
        </RouteGuard>
      } />

      {/* Common Routes */}
      <Route path="/business-tools" element={
        <RouteGuard>
          <BusinessTools />
        </RouteGuard>
      } />
      <Route path="/settings" element={
        <RouteGuard>
          <SystemSettings />
        </RouteGuard>
      } />
      <Route path="/pharmacies" element={
        <RouteGuard>
          <Pharmacies />
        </RouteGuard>
      } />
      <Route path="/analytics" element={<Analytics />} />

      {/* Retail Staff Management Route */}
      <Route path="/staff" element={
        <RouteGuard allowedRoles={['retail']} requireApproval>
          <StaffManagement />
        </RouteGuard>
      } />

      {/* Inventory Adjustments Route */}
      <Route path="/inventory-adjustments" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <InventoryAdjustments />
        </RouteGuard>
      } />

      {/* Audit Reports Route */}
      <Route path="/audit" element={
        <RouteGuard allowedRoles={['retail', 'wholesale']} requireApproval>
          <AuditReports />
        </RouteGuard>
      } />

      {/* POS Route for Retail and Wholesale */}
      <Route path="/pos" element={
        user?.role === 'wholesale' ? (
          <RouteGuard allowedRoles={['wholesale']} requireApproval>
            <WholesalePOS />
          </RouteGuard>
        ) : (
          <RouteGuard allowedRoles={['retail']} requireApproval>
            <RetailPos />
          </RouteGuard>
        )
      } />

      {/* Catch all - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
