// Basic tool demo UI for POS, Forecast, Adjustments, Credit Management. Adapt as needed.
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { posService, PosSale } from "@/services/posService";
import { inventoryForecastService, InventoryForecast } from "@/services/inventoryForecastService";
import { inventoryAdjustmentService, InventoryAdjustment } from "@/services/inventoryAdjustmentService";
import { creditService, WholesaleCreditAccount } from "@/services/creditService";
import { Input } from "@/components/ui/input";

const WholesaleBusinessTools = () => {
  const { user } = useAuth();
  
  // POS
  const [sales, setSales] = useState<PosSale[]>([]);
  // Forecasting
  const [forecasts, setForecasts] = useState<InventoryForecast[]>([]);
  // Adjustments
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  // Credit/CRM
  const [accounts, setAccounts] = useState<WholesaleCreditAccount[]>([]);

  // POS sales loading
  useEffect(() => { posService.fetchSales().then(setSales); }, []);
  // Forecasts loading
  useEffect(() => { inventoryForecastService.fetchForecasts().then(setForecasts); }, []);
  // Adjustments loading
  useEffect(() => { inventoryAdjustmentService.fetchAdjustments().then(setAdjustments); }, []);
  // Credit/CRM accounts loading
  useEffect(() => { creditService.fetchAccounts().then(setAccounts); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 space-y-10">
        <h1 className="text-4xl font-bold mb-6">Wholesale Business Tools (Preview)</h1>
        
        {/* POS Quick Log */}
        <Card>
          <CardHeader>
            <CardTitle>POS Sales (Last 5)</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.slice(0, 5).length === 0 ? (
              <div>No sales yet.</div>
            ) : (
              <ul>
                {sales.slice(0, 5).map(sale => (
                  <li key={sale.id} className="mb-2">
                    <span className="font-semibold">{new Date(sale.sale_date).toLocaleString()}</span>
                    {" — "}
                    <span>TZS {Number(sale.total_amount).toLocaleString()}</span>
                    {" ("}{sale.payment_method}{")"}
                  </li>
                ))}
              </ul>
            )}
            <Button size="sm" className="mt-2" disabled>New Sale (Coming soon)</Button>
          </CardContent>
        </Card>

        {/* Forecasts */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Forecasts (Recent)</CardTitle>
          </CardHeader>
          <CardContent>
            {forecasts.length === 0 ? (
              <div>No forecasts yet.</div>
            ) : (
              <ul>
                {forecasts.slice(0, 5).map(f => (
                  <li key={f.id}>
                    {f.product_id} | <b>{f.forecast_date}</b> | Demand: <b>{f.forecasted_demand}</b> {f.actual !== undefined && <> | Actual: <b>{f.actual}</b></>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Inventory Adjustments */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Adjustments (Recent)</CardTitle>
          </CardHeader>
          <CardContent>
            {adjustments.length === 0 ? (
              <div>No recent adjustments.</div>
            ) : (
              <ul>
                {adjustments.slice(0, 5).map(adj => (
                  <li key={adj.id}>
                    {adj.product_id} | <b>{adj.adjustment_type}</b> | Qty: {adj.quantity} | {adj.reason}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        {/* Credit Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Wholesale CRM / Credit Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div>No credit accounts.</div>
            ) : (
              <ul>
                {accounts.slice(0, 5).map(acc => (
                  <li key={acc.id}>
                    Retailer: {acc.retailer_id} | Limit: TZS {Number(acc.credit_limit).toLocaleString()} | Used: TZS {Number(acc.current_balance).toLocaleString()} | {acc.status}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WholesaleBusinessTools;
