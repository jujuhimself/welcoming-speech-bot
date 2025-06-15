
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import AdminApprovalsTab from "@/components/admin/AdminApprovalsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminAnalyticsTab from "@/components/admin/AdminAnalyticsTab";
import SystemAlertsTab from "@/components/admin/SystemAlertsTab";
import AuditLogsTab from "@/components/admin/AuditLogsTab";
import BackupsExportTab from "@/components/admin/BackupsExportTab";
import ImpersonateUserTab from "@/components/admin/ImpersonateUserTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notificationService } from "@/services/notificationService";
import { logError } from "@/utils/logger";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Package,
  Settings,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Eye,
  UserCheck,
  UserX,
  Bell,
  AlertTriangle,
  Download,
  Repeat2,
  User as UserIcon,
  ArrowRightLeft,
} from "lucide-react";
import { UserAccount } from "@/types/userAccount";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingUsers, setPendingUsers] = useState<UserAccount[]>([]);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    activeOrders: 0,
    pharmacies: 0,
    wholesalers: 0,
    labs: 0,
    individuals: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, email, role, is_approved, business_name, created_at")
          .order("created_at", { ascending: false });
        if (error) {
          logError(error, "AdminDashboard fetch profiles");
          toast({
            title: "Error loading users",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        const users: UserAccount[] = (data || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.is_approved === null || u.is_approved === false ? "pending" : "approved",
          businessName: u.business_name || "",
          registeredAt: u.created_at ? u.created_at.substring(0, 10) : "",
        }));

        setAllUsers(users);
        setPendingUsers(users.filter((u) => u.status === "pending"));

        setSystemStats({
          totalUsers: users.length,
          pendingApprovals: users.filter((u) => u.status === "pending").length,
          totalRevenue: 15750000,
          activeOrders: 43,
          pharmacies: users.filter((u) => u.role === "retail").length,
          wholesalers: users.filter((u) => u.role === "wholesale").length,
          labs: users.filter((u) => u.role === "lab").length,
          individuals: users.filter((u) => u.role === "individual").length,
        });
      } catch (err) {
        logError(err, "Unexpected error loading profiles");
        toast({
          title: "Load Error",
          description: "Could not load user accounts.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [user, navigate, toast]);

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true })
        .eq("id", userId);
      if (error) {
        logError(error, "Admin approve user");
        toast({
          title: "Approval failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      try {
        await notificationService.createNotification({
          user_id: userId,
          title: "Account Approved",
          message: "Your account has been approved by the BEPAWA admin. You can now access all features on the platform.",
          type: "success",
        });
      } catch (notifyErr) {
        logError(notifyErr, "Failed to send approval notification");
      }
      toast({
        title: "User Approved",
        description: "Account has been approved successfully.",
      });

      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "approved" as const } : u))
      );
      setSystemStats((prev) => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }));
    } catch (err) {
      logError(err, "Admin approve user exception");
      toast({
        title: "Approval failed",
        description: "Could not approve account.",
        variant: "destructive",
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: false })
        .eq("id", userId);
      if (error) {
        logError(error, "Admin reject user");
        toast({
          title: "Reject failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      try {
        await notificationService.createNotification({
          user_id: userId,
          title: "Account Rejected",
          message: "Unfortunately, your BEPAWA account was rejected by the admin. Please contact support@bepawa.com for more info.",
          type: "error",
        });
      } catch (notifyErr) {
        logError(notifyErr, "Failed to send rejection notification");
      }
      toast({
        title: "User Rejected",
        description: "Account has been rejected.",
        variant: "destructive",
      });
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "rejected" as const } : u))
      );
      setSystemStats((prev) => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
      }));
    } catch (err) {
      logError(err, "Admin reject user exception");
      toast({
        title: "User Rejection Failed",
        description: "Could not reject account.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "retail":
        return <Building className="h-4 w-4" />;
      case "wholesale":
        return <Package className="h-4 w-4" />;
      case "lab":
        return <Settings className="h-4 w-4" />;
      case "individual":
        return <Users className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Manage the BEPAWA healthcare platform
          </p>
        </div>
        <AdminStatsCards
          stats={{
            totalUsers: systemStats.totalUsers,
            pendingApprovals: systemStats.pendingApprovals,
            totalRevenue: systemStats.totalRevenue,
            activeOrders: systemStats.activeOrders,
          }}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="tools">Platform Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <AdminOverviewTab systemStats={systemStats} />
          </TabsContent>
          <TabsContent value="users" className="space-y-6">
            <AdminUsersTab
              allUsers={allUsers}
              getRoleIcon={getRoleIcon}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          <TabsContent value="approvals" className="space-y-6">
            <AdminApprovalsTab
              pendingUsers={pendingUsers}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
              getRoleIcon={getRoleIcon}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalyticsTab />
          </TabsContent>
          <TabsContent value="alerts" className="space-y-6">
            <SystemAlertsTab />
          </TabsContent>
          <TabsContent value="logs" className="space-y-6">
            <AuditLogsTab />
          </TabsContent>
          <TabsContent value="tools" className="space-y-6">
            <BackupsExportTab />
            <ImpersonateUserTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
