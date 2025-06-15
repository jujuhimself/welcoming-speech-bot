
import { supabase } from '@/integrations/supabase/client';

export interface InventoryAdjustment {
  id: string;
  user_id: string;
  product_id: string;
  adjustment_type: 'add' | 'remove';
  quantity: number;
  reason?: string;
  created_at: string;
}

class InventoryAdjustmentService {
  async createAdjustment(adjustment: Omit<InventoryAdjustment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('inventory_adjustments')
      .insert(adjustment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async fetchAdjustments(): Promise<InventoryAdjustment[]> {
    const { data, error } = await supabase
      .from('inventory_adjustments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Cast the data to match our interface types
    return (data || []).map(item => ({
      ...item,
      adjustment_type: item.adjustment_type as 'add' | 'remove'
    }));
  }
}

export const inventoryAdjustmentService = new InventoryAdjustmentService();
