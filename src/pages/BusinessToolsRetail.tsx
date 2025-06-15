
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import RetailPos from "./retail/RetailPos";
import RetailCredit from "./retail/RetailCredit";
import RetailAdjustment from "./retail/RetailAdjustment";
import RetailForecast from "./retail/RetailForecast";
import RetailAuditLog from "./retail/RetailAuditLog";

export default function BusinessToolsRetail() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p>Please log in to access business tools.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Retail Business Tools</h1>
          <p className="text-gray-600 text-lg">Comprehensive tools for pharmacy management</p>
        </div>

        <Tabs defaultValue="pos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pos">POS Sales</TabsTrigger>
            <TabsTrigger value="credit">Credit/CRM</TabsTrigger>
            <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
            <TabsTrigger value="forecast">Forecasts</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="pos">
            <RetailPos />
          </TabsContent>

          <TabsContent value="credit">
            <RetailCredit />
          </TabsContent>

          <TabsContent value="adjustments">
            <RetailAdjustment />
          </TabsContent>

          <TabsContent value="forecast">
            <RetailForecast />
          </TabsContent>

          <TabsContent value="audit">
            <RetailAuditLog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
