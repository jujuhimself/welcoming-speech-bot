
import { supabase } from "@/integrations/supabase/client";

export interface WholesaleCreditAccount {
  id: string;
  wholesaler_user_id: string;
  retailer_id: string;
  credit_limit: number;
  current_balance: number;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface WholesaleCreditTransaction {
  id: string;
  credit_account_id: string;
  transaction_type: string;
  amount: number;
  transaction_date: string;
  reference?: string;
  created_at: string;
}

class CreditService {
  async fetchAccounts() {
    const { data, error } = await supabase.from("wholesale_credit_accounts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as WholesaleCreditAccount[];
  }
  async fetchTransactions(accountId: string) {
    const { data, error } = await supabase.from("wholesale_credit_transactions").select("*").eq("credit_account_id", accountId).order("transaction_date", { ascending: false });
    if (error) throw error;
    return data as WholesaleCreditTransaction[];
  }
  async createAccount(account: Omit<WholesaleCreditAccount, "id" | "created_at" | "updated_at" | "status"> & { status?: string }) {
    const { data, error } = await supabase.from("wholesale_credit_accounts").insert([{ ...account, status: account.status ?? "active" }]).select().single();
    if (error) throw error;
    return data;
  }
  async addTransaction(tx: Omit<WholesaleCreditTransaction, "id" | "created_at" | "transaction_date">) {
    const { data, error } = await supabase.from("wholesale_credit_transactions").insert([tx]).select().single();
    if (error) throw error;
    return data;
  }
}
export const creditService = new CreditService();
