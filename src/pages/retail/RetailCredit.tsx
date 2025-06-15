
import { useState, useEffect } from "react";
import { creditService, WholesaleCreditAccount } from "@/services/creditService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function RetailCredit() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<WholesaleCreditAccount[]>([]);
  const [limit, setLimit] = useState("");
  const [retailer_id, setRetailerId] = useState("");

  useEffect(() => {
    creditService.fetchAccounts().then(setAccounts);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !limit || !retailer_id) return;

    try {
      await creditService.createAccount({
        wholesaler_user_id: user.id,
        retailer_id,
        credit_limit: Number(limit),
        current_balance: 0,
      });
      setLimit("");
      setRetailerId("");
      toast({ title: "Credit Account Created" });
      creditService.fetchAccounts().then(setAccounts);
    } catch {
      toast({ title: "Error creating account", variant: "destructive" });
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create Credit/CRM Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              placeholder="Retailer ID"
              value={retailer_id}
              onChange={e => setRetailerId(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Credit Limit"
              value={limit}
              onChange={e => setLimit(e.target.value)}
              min="0"
              required
            />
            <Button type="submit">Create Account</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Accounts (Preview)</CardTitle>
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
  );
}
