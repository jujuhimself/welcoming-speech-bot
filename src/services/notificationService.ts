import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'security' | 'maintenance' | 'update';
  is_active: boolean;
  target_roles?: string[];
  created_at: string;
  expires_at?: string;
}

export interface NotificationData {
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
}

class NotificationService {
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      type: item.type as Notification['type'],
      metadata: item.metadata as Record<string, any> | undefined,
    }));
  }

  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return {
      ...data,
      type: data.type as Notification['type'],
      metadata: data.metadata as Record<string, any> | undefined,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async getSystemAlerts(): Promise<SystemAlert[]> {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching system alerts:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      severity: item.severity as SystemAlert['severity'],
      category: item.category as SystemAlert['category'],
    }));
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }

  // Real-time subscription for notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const notification = payload.new as any;
          callback({
            ...notification,
            type: notification.type as Notification['type'],
            metadata: notification.metadata as Record<string, any> | undefined,
          });
        }
      )
      .subscribe();
  }

  // Create sample notifications for demonstration
  async createSampleNotifications(userId: string): Promise<void> {
    const sampleNotifications = [
      {
        user_id: userId,
        title: 'New Order Received',
        message: 'Order #ORD-2024-001 for TZS 45,000 from Mwalimu Pharmacy has been confirmed.',
        type: 'info' as const,
        metadata: {
          priority: 'high',
          category: 'order',
          actionUrl: '/wholesale/orders',
          actionLabel: 'View Order'
        }
      },
      {
        user_id: userId,
        title: 'Low Stock Alert',
        message: 'Paracetamol 500mg is running low (5 units remaining). Please restock soon.',
        type: 'warning' as const,
        metadata: {
          priority: 'high',
          category: 'inventory',
          actionUrl: '/wholesale/inventory',
          actionLabel: 'Restock Now'
        }
      },
      {
        user_id: userId,
        title: 'Payment Received',
        message: 'Payment of TZS 78,500 received from City Pharmacy. Order #ORD-2024-002.',
        type: 'success' as const,
        metadata: {
          priority: 'medium',
          category: 'payment',
          actionUrl: '/wholesale/business-tools',
          actionLabel: 'View Payment'
        }
      },
      {
        user_id: userId,
        title: 'System Maintenance',
        message: 'Scheduled maintenance on June 15th from 2:00 AM to 4:00 AM. System will be temporarily unavailable.',
        type: 'info' as const,
        metadata: {
          priority: 'low',
          category: 'system'
        }
      },
      {
        user_id: userId,
        title: 'Monthly Report Ready',
        message: 'Your May 2024 sales report is now available for download.',
        type: 'info' as const,
        metadata: {
          priority: 'medium',
          category: 'promotion',
          actionUrl: '/wholesale/analytics',
          actionLabel: 'Download Report'
        }
      },
      {
        user_id: userId,
        title: 'Order Shipped',
        message: 'Order #ORD-2024-002 has been shipped to Kilimani Pharmacy. Expected delivery: 2-3 business days.',
        type: 'success' as const,
        metadata: {
          priority: 'medium',
          category: 'delivery',
          actionUrl: '/wholesale/orders',
          actionLabel: 'Track Shipment'
        }
      },
      {
        user_id: userId,
        title: 'Credit Limit Warning',
        message: 'Your credit limit is at 85% capacity. Consider reviewing your outstanding balances.',
        type: 'warning' as const,
        metadata: {
          priority: 'medium',
          category: 'payment',
          actionUrl: '/wholesale/business-tools',
          actionLabel: 'View Credit'
        }
      },
      {
        user_id: userId,
        title: 'New Product Available',
        message: 'New product "Vitamin C 1000mg" is now available in your catalog.',
        type: 'info' as const,
        metadata: {
          priority: 'low',
          category: 'inventory',
          actionUrl: '/wholesale/inventory',
          actionLabel: 'View Product'
        }
      }
    ];

    try {
      for (const notification of sampleNotifications) {
        await this.createNotification(notification);
      }
    } catch (error) {
      console.error('Error creating sample notifications:', error);
    }
  }

  // Send notification to user
  async sendNotification(notification: NotificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          is_read: false
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send lab result notification
  async sendLabResultNotification(userId: string, testType: string, hasFile: boolean = false) {
    const title = 'Lab Results Ready';
    const message = `Your ${testType} results are now available. ${hasFile ? 'A detailed report has been uploaded.' : ''}`;
    
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'success',
      metadata: { 
        category: 'lab_result',
        testType, 
        hasFile 
      }
    });
  }

  // Send appointment reminder
  async sendAppointmentReminder(userId: string, appointmentDate: string, testType: string) {
    const title = 'Lab Appointment Reminder';
    const message = `Reminder: You have a ${testType} appointment scheduled for ${appointmentDate}.`;
    
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: 'info',
      metadata: { 
        category: 'appointment_reminder',
        appointmentDate, 
        testType 
      }
    });
  }

  // Get user notifications
  async getUserNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
