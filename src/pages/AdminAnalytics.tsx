
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Package, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { useEffect } from 'react';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Mock data for demonstration
  const platformStats = {
    totalUsers: 1247,
    activePharmacies: 45,
    totalTransactions: 8562,
    totalRevenue: 2847562,
    growthRate: 12.5,
    systemHealth: 98.7
  };

  const userGrowthData = [
    { month: 'Jan', users: 100, pharmacies: 5, labs: 2 },
    { month: 'Feb', users: 150, pharmacies: 8, labs: 3 },
    { month: 'Mar', users: 220, pharmacies: 12, labs: 4 },
    { month: 'Apr', users: 300, pharmacies: 18, labs: 6 },
    { month: 'May', users: 450, pharmacies: 25, labs: 8 },
    { month: 'Jun', users: 600, pharmacies: 32, labs: 10 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 125000, orders: 342 },
    { month: 'Feb', revenue: 185000, orders: 456 },
    { month: 'Mar', revenue: 245000, orders: 589 },
    { month: 'Apr', revenue: 320000, orders: 672 },
    { month: 'May', revenue: 425000, orders: 784 },
    { month: 'Jun', revenue: 580000, orders: 896 },
  ];

  const userDistribution = [
    { name: 'Retail Pharmacies', value: 45, color: '#3b82f6' },
    { name: 'Individuals', value: 1150, color: '#10b981' },
    { name: 'Wholesalers', value: 12, color: '#f59e0b' },
    { name: 'Labs', value: 40, color: '#8b5cf6' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  if (!user || user.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
          <p className="text-gray-600 text-lg">Comprehensive platform insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-blue-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{platformStats.growthRate}% this month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Active Pharmacies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.activePharmacies}</div>
              <div className="text-xs text-green-200">Licensed & Active</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalTransactions.toLocaleString()}</div>
              <div className="text-xs text-purple-200">Total Platform</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">TZS {(platformStats.totalRevenue / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-yellow-200">Platform Revenue</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-100">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.systemHealth}%</div>
              <div className="text-xs text-indigo-200">Uptime</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-red-200">Active Alerts</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="business">Business Metrics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="pharmacies" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="labs" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Transaction Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="orders" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>API Response Time</span>
                    <span className="font-bold text-green-600">125ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database Performance</span>
                    <span className="font-bold text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage Usage</span>
                    <span className="font-bold text-yellow-600">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Connections</span>
                    <span className="font-bold text-blue-600">1,247</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent System Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="font-medium">High Storage Usage</p>
                      <p className="text-sm text-gray-600">Storage usage at 67%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Increased Traffic</p>
                      <p className="text-sm text-gray-600">25% increase in API calls</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Pharmacies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>MediCare Pharmacy</span>
                    <span className="font-bold">TZS 245K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Plus</span>
                    <span className="font-bold">TZS 198K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>City Pharmacy</span>
                    <span className="font-bold">TZS 156K</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Product Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Antibiotics</span>
                    <span className="font-bold">2,456 orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pain Relief</span>
                    <span className="font-bold">1,892 orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vitamins</span>
                    <span className="font-bold">1,543 orders</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Dar es Salaam</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Arusha</span>
                    <span className="font-bold">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mwanza</span>
                    <span className="font-bold">18%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Monthly Platform Report</h3>
                      <p className="text-sm text-gray-500">Generated on June 1, 2024</p>
                    </div>
                    <button className="text-blue-600 hover:underline">Download PDF</button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">User Activity Analysis</h3>
                      <p className="text-sm text-gray-500">Generated on May 28, 2024</p>
                    </div>
                    <button className="text-blue-600 hover:underline">Download PDF</button>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Revenue Breakdown</h3>
                      <p className="text-sm text-gray-500">Generated on May 25, 2024</p>
                    </div>
                    <button className="text-blue-600 hover:underline">Download PDF</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics;
