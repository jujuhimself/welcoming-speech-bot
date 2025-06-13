
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  changed_by?: string;
  changed_at: string;
  notes?: string;
}

class OrderService {
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at');

    if (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }

    return data || [];
  }

  async createOrderItem(orderItem: Omit<OrderItem, 'id' | 'created_at'>): Promise<OrderItem> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItem)
      .select()
      .single();

    if (error) {
      console.error('Error creating order item:', error);
      throw error;
    }

    return data;
  }

  async getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('changed_at', { ascending: false });

    if (error) {
      console.error('Error fetching order status history:', error);
      throw error;
    }

    return data || [];
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status,
        changed_by: user.id,
        notes
      });

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
