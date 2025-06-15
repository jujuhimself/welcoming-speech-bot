
import { useState, useEffect } from "react";
import { inventoryForecastService, InventoryForecast } from "@/services/inventoryForecastService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function RetailForecast() {
  const { user } = useAuth();
  const [forecasted_demand, setForecastedDemand] = useState("");
  const [product_id, setProductId] = useState("");
  const [date, setDate] = useState("");
  const [forecasts, setForecasts] = useState<InventoryForecast[]>([]);

  useEffect(() => {
    inventoryForecastService.fetchForecasts().then(setForecasts);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !forecasted_demand || !product_id || !date) return;
    try {
      await inventoryForecastService.addForecast({
        user_id: user.id,
        product_id,
        forecast_date: date,
        forecasted_demand: Number(forecasted_demand)
      });
      setForecastedDemand("");
      setProductId("");
      setDate("");
      toast({ title: "Forecast logged" });
      inventoryForecastService.fetchForecasts().then(setForecasts);
    } catch {
      toast({ title: "Error logging forecast", variant: "destructive" });
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Log Inventory Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              placeholder="Product ID"
              value={product_id}
              onChange={e => setProductId(e.target.value)}
              required
            />
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            <Input
              type="number"
              value={forecasted_demand}
              onChange={e => setForecastedDemand(e.target.value)}
              placeholder="Forecasted Demand"
              min="0"
              required
            />
            <Button type="submit">Log Forecast</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Forecasts</CardTitle>
        </CardHeader>
        <CardContent>
          {forecasts.length === 0 ? (
            <div>No forecasts yet.</div>
          ) : (
            <ul>
              {forecasts.slice(0, 5).map(f => (
                <li key={f.id}>
                  {f.product_id} | <b>{f.forecast_date}</b> | Demand: {f.forecasted_demand} {f.actual !== undefined && <>| Actual: {f.actual}</>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
