
import { supabase } from "@/integrations/supabase/client";

export interface PosSale {
  id: string;
  user_id: string;
  sale_date: string;
  total_amount: number;
  payment_method: string;
  customer_name?: string;
  created_at: string;
}
export interface PosSaleItem {
  id: string;
  pos_sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

class PosService {
  async createSale(sale: Omit<PosSale, "id" | "created_at">, items: Omit<PosSaleItem, "id" | "pos_sale_id" | "created_at">[]) {
    const { data, error } = await supabase
      .from("pos_sales")
      .insert([sale])
      .select()
      .single();
    if (error || !data) throw error;

    const pos_sale_id = data.id;
    for (const item of items) {
      await supabase.from("pos_sale_items").insert({ ...item, pos_sale_id });
    }
    return pos_sale_id;
  }

  async fetchSales() {
    const { data, error } = await supabase.from("pos_sales").select("*").order("sale_date", { ascending: false });
    if (error) throw error;
    return data as PosSale[];
  }
}

export const posService = new PosService();
