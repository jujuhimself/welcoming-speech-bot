
import { useEffect, useState } from "react";
import { posService, PosSale } from "@/services/posService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function RetailPos() {
  const { user } = useAuth();
  const [sales, setSales] = useState<PosSale[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  useEffect(() => {
    posService.fetchSales().then(setSales);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || Number(amount) <= 0) return;

    try {
      await posService.createSale(
        {
          user_id: user.id,
          sale_date: new Date().toISOString(),
          total_amount: Number(amount),
          payment_method: method,
        },
        []
      );
      setAmount("");
      setMethod("cash");
      toast({ title: "Sale logged" });
      posService.fetchSales().then(setSales);
    } catch {
      toast({ title: "Error logging sale", variant: "destructive" });
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Log POS Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Total Amount"
              min="0"
              required
            />
            <select
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="border rounded px-2 py-1"
              required
            >
              <option value="cash">Cash</option>
              <option value="mpesa">M-PESA</option>
              <option value="card">Card</option>
            </select>
            <Button type="submit">Log Sale</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent POS Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div>No sales yet.</div>
          ) : (
            <ul>
              {sales.slice(0, 5).map(sale => (
                <li key={sale.id}>
                  {new Date(sale.sale_date).toLocaleString()} — TZS {Number(sale.total_amount).toLocaleString()} ({sale.payment_method})
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
