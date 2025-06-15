import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Building, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  Settings,
  UserCheck,
  UserX,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/utils/logger";
import { notificationService } from "@/services/notificationService";

// UI Interface same as before for types
interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  businessName?: string;
  registeredAt: string;
}

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
    individuals: 0
  });

  // Fetch users and pending approvals from Supabase
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Fetch users from "profiles"
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, role, is_approved, business_name, created_at')
          .order('created_at', { ascending: false });
        if (error) {
          logError(error, "AdminDashboard fetch profiles");
          toast({
            title: "Error loading users",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        const users: UserAccount[] = (data || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.is_approved === null || u.is_approved === false ? 'pending' : 'approved',
          businessName: u.business_name || "",
          registeredAt: u.created_at ? u.created_at.substring(0,10) : "",
        }));

        setAllUsers(users);
        setPendingUsers(users.filter(u => u.status === "pending"));

        // Example stats (revenue/orders = 0, you can extend later)
        setSystemStats({
          totalUsers: users.length,
          pendingApprovals: users.filter(u => u.status === "pending").length,
          totalRevenue: 15750000,
          activeOrders: 43,
          pharmacies: users.filter(u => u.role === 'retail').length,
          wholesalers: users.filter(u => u.role === 'wholesale').length,
          labs: users.filter(u => u.role === 'lab').length,
          individuals: users.filter(u => u.role === 'individual').length
        });
      } catch (err) {
        logError(err, "Unexpected error loading profiles");
        toast({
          title: "Load Error",
          description: "Could not load user accounts.",
          variant: "destructive"
        });
      }
    };

    fetchUsers();
  }, [user, navigate, toast]);

  // Approve user handler (update is_approved = true)
  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId);
      if (error) {
        logError(error, "Admin approve user");
        toast({
          title: "Approval failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Send notification to the user
      try {
        await notificationService.createNotification({
          user_id: userId,
          title: "Account Approved",
          message: "Your account has been approved by the BEPAWA admin. You can now access all features on the platform.",
          type: "success"
        });
      } catch (notifyErr) {
        logError(notifyErr, "Failed to send approval notification");
      }

      toast({
        title: "User Approved",
        description: "Account has been approved successfully.",
      });
      // Update lists
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      setAllUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'approved' as const } : u
      ));
      setSystemStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));
    } catch (err) {
      logError(err, "Admin approve user exception");
      toast({
        title: "Approval failed",
        description: "Could not approve account.",
        variant: "destructive"
      });
    }
  };

  // Reject user handler (update is_approved = false)
  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId);
      if (error) {
        logError(error, "Admin reject user");
        toast({
          title: "Reject failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Send notification to the user
      try {
        await notificationService.createNotification({
          user_id: userId,
          title: "Account Rejected",
          message: "Unfortunately, your BEPAWA account was rejected by the admin. Please contact support@bepawa.com for more info.",
          type: "error"
        });
      } catch (notifyErr) {
        logError(notifyErr, "Failed to send rejection notification");
      }

      toast({
        title: "User Rejected",
        description: "Account has been rejected.",
        variant: "destructive"
      });
      // Update lists
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      setAllUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: 'rejected' as const } : u
      ));
      setSystemStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));
    } catch (err) {
      logError(err, "Admin reject user exception");
      toast({
        title: "User Rejection Failed",
        description: "Could not reject account.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'retail': return <Building className="h-4 w-4" />;
      case 'wholesale': return <Package className="h-4 w-4" />;
      case 'lab': return <Settings className="h-4 w-4" />;
      case 'individual': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage the BEPAWA healthcare platform</p>
        </div>
        {/* System Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemStats.totalUsers}</div>
              <div className="flex items-center mt-2">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm text-blue-100">All accounts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemStats.pendingApprovals}</div>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm text-yellow-100">Awaiting review</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TZS {systemStats.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm text-green-100">This month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{systemStats.activeOrders}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm text-purple-100">In progress</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="approvals">Account Approvals</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">System Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pharmacies</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.pharmacies}</div>
                  <p className="text-xs text-muted-foreground">Retail partners</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wholesalers</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.wholesalers}</div>
                  <p className="text-xs text-muted-foreground">Distribution partners</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Labs</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.labs}</div>
                  <p className="text-xs text-muted-foreground">Laboratory partners</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Individuals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.individuals}</div>
                  <p className="text-xs text-muted-foreground">Individual users</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">New pharmacy approved</p>
                        <p className="text-sm text-gray-600">City Pharmacy - Dar es Salaam</p>
                      </div>
                    </div>
                    <Badge variant="default">2 hours ago</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Large order processed</p>
                        <p className="text-sm text-gray-600">TZS 2,450,000 - MedSupply to HealthPharm</p>
                      </div>
                    </div>
                    <Badge variant="outline">4 hours ago</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">System maintenance scheduled</p>
                        <p className="text-sm text-gray-600">Weekend update - June 8-9</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Pending Account Approvals ({pendingUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            {getRoleIcon(user.role)}
                            <div>
                              <h4 className="font-semibold">{user.businessName || user.name}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                {getStatusBadge(user.status)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Registered</p>
                            <p className="text-sm font-medium">{user.registeredAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectUser(user.id)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All User Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(user.role)}
                        <div>
                          <h4 className="font-semibold">{user.businessName || user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                            {getStatusBadge(user.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>New registrations this week</span>
                      <Badge variant="default">+12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Order volume growth</span>
                      <Badge variant="default">+18%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Revenue growth</span>
                      <Badge variant="default">+25%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Server uptime</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">99.9%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average response time</span>
                      <Badge variant="outline">120ms</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active sessions</span>
                      <Badge variant="outline">247</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
