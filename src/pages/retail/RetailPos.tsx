
import { useEffect, useState } from "react";
import { posService, PosSale } from "@/services/posService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ExportButton from "@/components/ExportButton";
import DateRangeFilter from "@/components/DateRangeFilter";
import UserSelect from "@/components/UserSelect";

export default function RetailPos() {
  const { user } = useAuth();
  const [sales, setSales] = useState<PosSale[]>([]);
  const [filtered, setFiltered] = useState<PosSale[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  // Filters
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [userId, setUserId] = useState("");
  const [payType, setPayType] = useState("");

  useEffect(() => {
    posService.fetchSales().then(setSales);
  }, []);

  useEffect(() => {
    setFiltered(
      sales.filter(s => {
        const dateOk = (!from || new Date(s.sale_date) >= new Date(from)) &&
          (!to || new Date(s.sale_date) <= new Date(to));
        const userOk = !userId || s.user_id === userId;
        const pmOk = !payType || s.payment_method === payType;
        return dateOk && userOk && pmOk;
      })
    );
  }, [sales, from, to, userId, payType]);

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
          <CardTitle>
            Recent POS Sales
            <span className="float-right">
              <ExportButton
                data={filtered}
                filename="sales.csv"
                disabled={filtered.length === 0}
              />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2 items-center">
            <DateRangeFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
            <UserSelect value={userId} onChange={setUserId} user={user} />
            <div>
              <label className="text-sm mr-1">Payment Method:</label>
              <select className="border rounded px-2 py-1 text-sm"
                value={payType} onChange={e => setPayType(e.target.value)}>
                <option value="">All</option>
                <option value="cash">Cash</option>
                <option value="mpesa">M-PESA</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div>No sales found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Pay Method</th>
                    <th>User</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 20).map(sale => (
                    <tr key={sale.id}>
                      <td>{new Date(sale.sale_date).toLocaleString()}</td>
                      <td>{Number(sale.total_amount).toLocaleString("en-US", { style: "currency", currency: "TZS" })}</td>
                      <td className="capitalize">{sale.payment_method}</td>
                      <td className="text-blue-800">{sale.user_id}</td>
                      <td>{sale.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
