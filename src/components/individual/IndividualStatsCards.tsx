
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock, Heart, FileText } from "lucide-react";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  savedItems: number;
  activePrescriptions: number;
}

const IndividualStatsCards = ({ stats }: { stats: Stats }) => (
  <div className="grid md:grid-cols-4 gap-6 mb-8">
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-100">My Orders</CardTitle>
        <ShoppingCart className="h-4 w-4 text-blue-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.totalOrders}</div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-yellow-100">Pending Orders</CardTitle>
        <Clock className="h-4 w-4 text-yellow-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.pendingOrders}</div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-red-100">Saved Items</CardTitle>
        <Heart className="h-4 w-4 text-red-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {stats.savedItems} <span className="text-xs text-white font-normal">{stats.savedItems === 0 ? "(not synced to Supabase yet)" : ""}</span>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-green-100">Active Prescriptions</CardTitle>
        <FileText className="h-4 w-4 text-green-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{stats.activePrescriptions}</div>
      </CardContent>
    </Card>
  </div>
);

export default IndividualStatsCards;
