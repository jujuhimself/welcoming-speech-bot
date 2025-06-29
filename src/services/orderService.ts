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

export type WholesaleOrder = {
  id: string;
  order_number: string;
  pharmacy_id: string | null;
  pharmacyName?: string;
  pharmacyLocation?: string;
  items: any[];
  total_amount: number;
  status: string;
  priority?: string;
  created_at: string;
  updated_at: string;
  expectedDelivery?: string;
  payment_status: string;
  shipping_address?: any;
};

export type RetailOrder = {
  id: string;
  order_number: string;
  wholesaler_id: string | null;
  items: any[];
  total_amount: number;
  status: string;
  priority?: string;
  created_at: string;
  updated_at: string;
  expectedDelivery?: string;
  payment_status: string;
  shipping_address?: any;
};

export interface PlatformOrder {
  id: string;
  user_id: string;
  order_number: string;
  order_type?: 'retail' | 'wholesale' | 'prescription' | 'lab';
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  shipping_address?: any;
  billing_address?: any;
  items: any;
  notes?: string;
  created_at: string;
  updated_at: string;
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

  async getWholesaleOrders(wholesalerId: string): Promise<WholesaleOrder[]> {
    const { data, error } = await supabase.rpc('get_orders_by_wholesaler', { wholesaler_uuid: wholesalerId });
    if (error) {
      console.error('Error fetching wholesale orders:', error);
      throw error;
    }
    return (data || []).map((order: any) => ({
      ...order,
      items: Array.isArray(order.items) ? order.items : (order.items ? JSON.parse(order.items) : []),
      shipping_address: typeof order.shipping_address === 'object' ? order.shipping_address : (order.shipping_address ? JSON.parse(order.shipping_address) : undefined),
    }));
  }

  async getRetailOrders(retailerId: string): Promise<RetailOrder[]> {
    const { data, error } = await supabase.rpc('get_orders_by_retailer', { retailer_uuid: retailerId });
    if (error) {
      console.error('Error fetching retail orders:', error);
      throw error;
    }
    return (data || []).map((order: any) => ({
      ...order,
      items: Array.isArray(order.items) ? order.items : (order.items ? JSON.parse(order.items) : []),
      shipping_address: typeof order.shipping_address === 'object' ? order.shipping_address : (order.shipping_address ? JSON.parse(order.shipping_address) : undefined),
    }));
  }

  // New function to create platform orders
  async createPlatformOrder(orderData: Omit<PlatformOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PlatformOrder> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        order_type: orderData.order_type || 'retail',
        order_number: orderData.order_number || this.generateOrderNumber(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating platform order:', error);
      throw error;
    }

    return data;
  }

  // New function to get platform revenue
  async getPlatformRevenue(): Promise<number> {
    let totalRevenue = 0;

    // Get revenue from orders table
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount')
      .in('status', ['completed', 'delivered', 'paid'])
      .eq('payment_status', 'paid');

    if (!ordersError && ordersData) {
      totalRevenue += ordersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    }

    // Get revenue from lab_orders table
    const { data: labOrdersData, error: labOrdersError } = await supabase
      .from('lab_orders')
      .select('total_amount')
      .in('status', ['completed'])
      .eq('payment_status', 'paid');

    if (!labOrdersError && labOrdersData) {
      totalRevenue += labOrdersData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    }

    return totalRevenue;
  }

  // Helper function to generate order numbers
  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-6);
    return `${dateStr}-${timeStr}`;
  }
}

export const orderService = new OrderService();
