
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp,
  Package,
  AlertTriangle,
  Calendar as CalendarIcon,
  DollarSign
} from "lucide-react";
import { useProducts, useLowStockProducts, useExpiringProducts, useSalesAnalytics } from "@/hooks/useInventory";
import { format } from "date-fns";

const InventoryReports = () => {
  const [dateRange, setDateRange] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined
  });

  const { data: products = [] } = useProducts();
  const { data: lowStockProducts = [] } = useLowStockProducts();
  const { data: expiringProducts = [] } = useExpiringProducts();
  const { data: salesData = [] } = useSalesAnalytics(
    dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined
  );

  const generateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report for period:`, dateRange);
    // TODO: Implement actual report generation
  };

  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.buy_price), 0);
  const totalProfit = products.reduce((sum, product) => sum + (product.stock * (product.sell_price - product.buy_price)), 0);
  const totalSales = salesData.reduce((sum, day) => sum + day.total_sales, 0);

  const reportTypes = [
    {
      name: "Stock Valuation Report",
      description: "Current inventory value and stock levels",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      data: `TZS ${totalValue.toLocaleString()}`,
      type: "stock-valuation"
    },
    {
      name: "Low Stock Alert Report",
      description: "Products below minimum stock levels",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      data: `${lowStockProducts.length} items`,
      type: "low-stock"
    },
    {
      name: "Expiry Report",
      description: "Products nearing expiration dates",
      icon: <CalendarIcon className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      data: `${expiringProducts.length} items`,
      type: "expiry"
    },
    {
      name: "Sales Performance Report",
      description: "Sales analytics and trends",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      data: `TZS ${totalSales.toLocaleString()}`,
      type: "sales-performance"
    },
    {
      name: "Profit Analysis Report",
      description: "Profit margins and profitability analysis",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      data: `TZS ${totalProfit.toLocaleString()}`,
      type: "profit-analysis"
    },
    {
      name: "Inventory Movement Report",
      description: "Stock in/out movements and transactions",
      icon: <Package className="h-5 w-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      data: `${products.length} products`,
      type: "inventory-movement"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm font-medium">Date Range (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.from && dateRange.to 
                      ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                      : "Select date range"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {(dateRange.from || dateRange.to) && (
              <Button 
                variant="outline" 
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                Clear Dates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <Tabs defaultValue="available-reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available-reports">Available Reports</TabsTrigger>
          <TabsTrigger value="recent-reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled-reports">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="available-reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${report.bgColor}`}>
                      <div className={report.color}>
                        {report.icon}
                      </div>
                    </div>
                    <Badge variant="outline">{report.data}</Badge>
                  </div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => generateReport(report.type)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent-reports" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent reports</h3>
              <p className="text-gray-600">Generated reports will appear here for easy access.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled-reports" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled reports</h3>
              <p className="text-gray-600 mb-4">Set up automatic report generation on a schedule.</p>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">TZS {totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Inventory Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
              <p className="text-sm text-gray-600">Low Stock Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">TZS {totalProfit.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Potential Profit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryReports;
