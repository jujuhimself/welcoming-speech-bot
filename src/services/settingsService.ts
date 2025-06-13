
import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'business_only';
    data_sharing: boolean;
    analytics_tracking: boolean;
  };
  business_settings?: {
    tax_rate: number;
    default_payment_terms: string;
    low_stock_threshold: number;
    auto_reorder: boolean;
  };
  created_at: string;
  updated_at: string;
}

class SettingsService {
  async getUserSettings(): Promise<UserSettings | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user settings:', error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      theme: data.theme as UserSettings['theme'],
      notifications: data.notifications as UserSettings['notifications'],
      privacy: data.privacy as UserSettings['privacy'],
      business_settings: data.business_settings as UserSettings['business_settings'],
    };
  }

  async updateUserSettings(settings: Partial<Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<UserSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }

    return {
      ...data,
      theme: data.theme as UserSettings['theme'],
      notifications: data.notifications as UserSettings['notifications'],
      privacy: data.privacy as UserSettings['privacy'],
      business_settings: data.business_settings as UserSettings['business_settings'],
    };
  }

  async resetToDefaults(): Promise<UserSettings> {
    const defaultSettings = {
      theme: 'system' as const,
      language: 'en',
      timezone: 'UTC',
      currency: 'TZS',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
      },
      privacy: {
        profile_visibility: 'business_only' as const,
        data_sharing: false,
        analytics_tracking: true,
      },
      business_settings: {
        tax_rate: 18,
        default_payment_terms: '30 days',
        low_stock_threshold: 10,
        auto_reorder: false,
      },
    };

    return this.updateUserSettings(defaultSettings);
  }
}

export const settingsService = new SettingsService();
