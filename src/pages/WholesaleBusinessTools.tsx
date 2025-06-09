
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  TrendingUp,
  BarChart3,
  DollarSign,
  Download,
  Calculator,
  PieChart,
  Target,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const WholesaleBusinessTools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 4500000, profit: 1350000 },
    { month: 'Feb', sales: 5200000, profit: 1560000 },
    { month: 'Mar', sales: 4800000, profit: 1440000 },
    { month: 'Apr', sales: 6100000, profit: 1830000 },
    { month: 'May', sales: 5800000, profit: 1740000 },
    { month: 'Jun', sales: 6500000, profit: 1950000 }
  ];

  const categoryData = [
    { name: 'Pain Relief', value: 35, color: '#8884d8' },
    { name: 'Antibiotics', value: 25, color: '#82ca9d' },
    { name: 'Vitamins', value: 20, color: '#ffc658' },
    { name: 'Diabetes', value: 15, color: '#ff7300' },
    { name: 'Others', value: 5, color: '#00ff00' }
  ];

  const profitabilityData = [
    { product: 'Paracetamol 500mg', revenue: 875000, cost: 612500, profit: 262500, margin: 30 },
    { product: 'Amoxicillin 250mg', revenue: 720000, cost: 540000, profit: 180000, margin: 25 },
    { product: 'Vitamin C 1000mg', revenue: 450000, cost: 337500, profit: 112500, margin: 25 },
    { product: 'Insulin Injection', revenue: 300000, cost: 240000, profit: 60000, margin: 20 },
    { product: 'Cough Syrup', revenue: 280000, cost: 224000, profit: 56000, margin: 20 }
  ];

  const generateInvoice = () => {
    toast({
      title: "Invoice Generated",
      description: "Professional invoice has been created and saved.",
    });
  };

  const exportReport = (type: string) => {
    toast({
      title: "Report Exported",
      description: `${type} report has been exported to PDF.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Tools</h1>
          <p className="text-gray-600 text-lg">Advanced analytics and business management tools</p>
        </div>

        <Tabs defaultValue="invoice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoice">Invoice Generator</TabsTrigger>
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Invoice Generator */}
          <TabsContent value="invoice">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Professional Invoice Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Invoice Number</label>
                      <Input value={`INV-${Date.now().toString().slice(-6)}`} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Client</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="city-pharmacy">City Pharmacy</SelectItem>
                        <SelectItem value="healthcare-plus">HealthCare Plus</SelectItem>
                        <SelectItem value="medipoint">MediPoint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input placeholder="Invoice description..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Amount</label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                      <Input type="number" placeholder="18" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={generateInvoice} className="w-full bg-blue-600 hover:bg-blue-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Professional Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Invoice preview will appear here</p>
                    <p className="text-sm text-gray-400 mt-2">Fill in the form to generate invoice</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Overview */}
          <TabsContent value="sales">
            <div className="space-y-6">
              {/* Controls */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-center">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button onClick={() => exportReport('Sales')} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Sales</p>
                        <p className="text-2xl font-bold">TZS 32.9M</p>
                        <p className="text-blue-200 text-sm">+12% from last month</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Gross Profit</p>
                        <p className="text-2xl font-bold">TZS 9.87M</p>
                        <p className="text-green-200 text-sm">30% margin</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Orders</p>
                        <p className="text-2xl font-bold">847</p>
                        <p className="text-purple-200 text-sm">+8% from last month</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Avg Order Value</p>
                        <p className="text-2xl font-bold">TZS 38,850</p>
                        <p className="text-orange-200 text-sm">+5% from last month</p>
                      </div>
                      <Calculator className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales & Profit Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`TZS ${Number(value).toLocaleString()}`, '']} />
                        <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                        <Bar dataKey="profit" fill="#10b981" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Profitability Analysis */}
          <TabsContent value="profitability">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Product Profitability Analysis
                    </CardTitle>
                    <Button onClick={() => exportReport('Profitability')} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Product</th>
                          <th className="text-right py-3 px-4">Revenue</th>
                          <th className="text-right py-3 px-4">Cost</th>
                          <th className="text-right py-3 px-4">Profit</th>
                          <th className="text-right py-3 px-4">Margin</th>
                          <th className="text-center py-3 px-4">Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitabilityData.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium">{item.product}</td>
                            <td className="py-4 px-4 text-right">TZS {item.revenue.toLocaleString()}</td>
                            <td className="py-4 px-4 text-right">TZS {item.cost.toLocaleString()}</td>
                            <td className="py-4 px-4 text-right font-bold text-green-600">
                              TZS {item.profit.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Badge 
                                className={item.margin >= 25 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                              >
                                {item.margin}%
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${item.margin * 2}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Profitability Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm">Average Margin</p>
                        <p className="text-3xl font-bold">24%</p>
                        <p className="text-indigo-200 text-sm">Across all products</p>
                      </div>
                      <PieChart className="h-8 w-8 text-indigo-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm">Best Performer</p>
                        <p className="text-xl font-bold">Paracetamol</p>
                        <p className="text-emerald-200 text-sm">30% margin</p>
                      </div>
                      <Target className="h-8 w-8 text-emerald-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-100 text-sm">Improvement Needed</p>
                        <p className="text-xl font-bold">2 Products</p>
                        <p className="text-amber-200 text-sm">Below 25% margin</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-amber-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Business Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Revenue Growth</span>
                        <span className="text-green-600">+12%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Customer Satisfaction</span>
                        <span className="text-blue-600">4.8/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Order Fulfillment</span>
                        <span className="text-purple-600">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Inventory Turnover</span>
                        <span className="text-orange-600">6.2x</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Key Business Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">156</p>
                        <p className="text-sm text-gray-600">Active Retailers</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">2.1M</p>
                        <p className="text-sm text-gray-600">Products Moved</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">94%</p>
                        <p className="text-sm text-gray-600">On-time Delivery</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">18</p>
                        <p className="text-sm text-gray-600">Avg. Days Payment</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Top Regions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Dar es Salaam</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Arusha</span>
                          <span className="font-medium">25%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mwanza</span>
                          <span className="font-medium">18%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Others</span>
                          <span className="font-medium">12%</span>
                        </div>
                      </div>
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

export default WholesaleBusinessTools;
