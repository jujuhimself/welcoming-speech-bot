import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  sku: string;
  description?: string;
  stock: number;
  min_stock: number;
  max_stock?: number;
  buy_price: number;
  sell_price: number;
  supplier?: string;
  expiry_date?: string;
  batch_number?: string;
  last_ordered?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  user_id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  reference_number?: string;
  cost_per_unit?: number;
  created_at: string;
  created_by?: string;
}

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  user_id: string;
  supplier_id?: string;
  po_number: string;
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  total_amount: number;
  order_date: string;
  expected_delivery?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  received_quantity?: number;
  created_at: string;
}

class InventoryService {
  // Enhanced products methods with better error handling
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('status', 'deleted')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return (data || []).map(product => ({
        ...product,
        status: product.status as Product['status']
      }));
    } catch (error) {
      console.error('InventoryService.getProducts error:', error);
      throw error;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as Product['status']
      };
    } catch (error) {
      console.error('InventoryService.createProduct error:', error);
      throw error;
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Product['status']
    };
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async updateStock(productId: string, newStock: number, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId);

    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Inventory movements methods
  async getInventoryMovements(productId?: string): Promise<InventoryMovement[]> {
    let query = supabase
      .from('inventory_movements')
      .select('*')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inventory movements:', error);
      throw error;
    }

    return (data || []).map(movement => ({
      ...movement,
      movement_type: movement.movement_type as InventoryMovement['movement_type']
    }));
  }

  async createInventoryMovement(movement: Omit<InventoryMovement, 'id' | 'user_id' | 'created_at' | 'created_by'>): Promise<InventoryMovement> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('inventory_movements')
      .insert({
        ...movement,
        user_id: user.id,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating inventory movement:', error);
      throw error;
    }

    return {
      ...data,
      movement_type: data.movement_type as InventoryMovement['movement_type']
    };
  }

  // Suppliers methods
  async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }

    return data || [];
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        ...supplier,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }

    return data;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }

    return data;
  }

  // Purchase Orders methods
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }

    return (data || []).map(order => ({
      ...order,
      status: order.status as PurchaseOrder['status']
    }));
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrder> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('purchase_orders')
      .insert({
        ...order,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as PurchaseOrder['status']
    };
  }

  async getPurchaseOrderItems(purchaseOrderId: string): Promise<PurchaseOrderItem[]> {
    const { data, error } = await supabase
      .from('purchase_order_items')
      .select('*')
      .eq('purchase_order_id', purchaseOrderId)
      .order('created_at');

    if (error) {
      console.error('Error fetching purchase order items:', error);
      throw error;
    }

    return data || [];
  }

  async createPurchaseOrderItem(item: Omit<PurchaseOrderItem, 'id' | 'created_at'>): Promise<PurchaseOrderItem> {
    const { data, error } = await supabase
      .from('purchase_order_items')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating purchase order item:', error);
      throw error;
    }

    return data;
  }

  // Analytics methods
  async getLowStockProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or('status.eq.low-stock,status.eq.out-of-stock')
      .order('stock');

    if (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }

    return (data || []).map(product => ({
      ...product,
      status: product.status as Product['status']
    }));
  }

  async getExpiringProducts(days: number = 30): Promise<Product[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lte('expiry_date', futureDate.toISOString().split('T')[0])
      .gt('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date');

    if (error) {
      console.error('Error fetching expiring products:', error);
      throw error;
    }

    return (data || []).map(product => ({
      ...product,
      status: product.status as Product['status']
    }));
  }
}

export const inventoryService = new InventoryService();
