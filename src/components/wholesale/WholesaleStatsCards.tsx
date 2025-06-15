
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";

interface StatsProps {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    activeRetailers: number;
    lowStockItems: number;
  };
}
const WholesaleStatsCards = ({ stats }: StatsProps) => (
  <div className="grid md:grid-cols-4 gap-6 mb-8">
    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-green-200" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">TZS {stats.totalRevenue.toLocaleString()}</div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
        <Package className="h-4 w-4 text-blue-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.totalOrders}</div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-100">Active Retailers</CardTitle>
        <Users className="h-4 w-4 text-purple-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.activeRetailers}</div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-orange-100">Low Stock Items</CardTitle>
        <TrendingUp className="h-4 w-4 text-orange-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.lowStockItems}</div>
      </CardContent>
    </Card>
  </div>
);

export default WholesaleStatsCards;
