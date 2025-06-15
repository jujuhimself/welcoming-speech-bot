
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Helper to convert possible stringified JSON to object
function safeParseJsonField(field: any): Record<string, any> | undefined {
  if (!field) return undefined;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return undefined;
    }
  }
  // Supabase may already return an object
  if (typeof field === 'object') return field;
  return undefined;
}

class AuditService {
  async logAction(
    action: string,
    resourceType: string,
    resourceId?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const logEntry = {
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
      };

      const { error } = await supabase
        .from('audit_logs')
        .insert(logEntry);

      if (error) {
        console.error('Error logging audit action:', error);
      }
    } catch (error) {
      console.error('Error in audit logging:', error);
    }
  }

  async getAuditLogs(
    resourceType?: string,
    resourceId?: string,
    limit: number = 50
  ): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }

    if (resourceId) {
      query = query.eq('resource_id', resourceId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }

    return (data || []).map((entry: any) => ({
      ...entry,
      old_values: safeParseJsonField(entry.old_values),
      new_values: safeParseJsonField(entry.new_values)
    }));
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }

    return (data || []).map((entry: any) => ({
      ...entry,
      old_values: safeParseJsonField(entry.old_values),
      new_values: safeParseJsonField(entry.new_values)
    }));
  }

  private async getClientIP(): Promise<string | undefined> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return undefined;
    }
  }

  // Convenience methods for common actions
  async logLogin(): Promise<void> {
    await this.logAction('login', 'auth');
  }

  async logLogout(): Promise<void> {
    await this.logAction('logout', 'auth');
  }

  async logProductCreate(productId: string, productData: any): Promise<void> {
    await this.logAction('create', 'product', productId, undefined, productData);
  }

  async logProductUpdate(productId: string, oldData: any, newData: any): Promise<void> {
    await this.logAction('update', 'product', productId, oldData, newData);
  }

  async logProductDelete(productId: string, productData: any): Promise<void> {
    await this.logAction('delete', 'product', productId, productData);
  }

  async logOrderCreate(orderId: string, orderData: any): Promise<void> {
    await this.logAction('create', 'order', orderId, undefined, orderData);
  }

  async logOrderUpdate(orderId: string, oldData: any, newData: any): Promise<void> {
    await this.logAction('update', 'order', orderId, oldData, newData);
  }

  async logInventoryMovement(productId: string, movementData: any): Promise<void> {
    await this.logAction('inventory_movement', 'product', productId, undefined, movementData);
  }

  async logSettingsUpdate(oldSettings: any, newSettings: any): Promise<void> {
    await this.logAction('update', 'settings', undefined, oldSettings, newSettings);
  }
}

export const auditService = new AuditService();
