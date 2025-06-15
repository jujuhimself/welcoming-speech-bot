
import { useAuth } from "@/contexts/AuthContext";
import RetailPos from "./retail/RetailPos";
import RetailCredit from "./retail/RetailCredit";
import RetailAdjustment from "./retail/RetailAdjustment";
import RetailForecast from "./retail/RetailForecast";
import RetailAuditLog from "./retail/RetailAuditLog";
import { Card, CardContent } from "@/components/ui/card";

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

  // Render a default tool or provide a placeholder
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <Card className="p-8 w-full max-w-3xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-6">Retail Business Tools</h1>
          {/* Render one section as default, others are navigated via sidebar */}
          <RetailPos />
        </CardContent>
      </Card>
    </div>
  );
}
