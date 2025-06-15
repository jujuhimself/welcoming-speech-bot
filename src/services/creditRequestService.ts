
import { supabase } from '@/integrations/supabase/client';

export interface CreditRequest {
  id: string;
  user_id: string;
  business_name: string;
  requested_amount: number;
  business_type: string;
  monthly_revenue: number;
  years_in_business: number;
  credit_purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  documents: string[];
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  review_notes?: string;
}

export interface CreditAccount {
  id: string;
  user_id: string;
  credit_limit: number;
  current_balance: number;
  available_credit: number;
  interest_rate: number;
  status: 'active' | 'suspended' | 'closed';
  created_at: string;
  updated_at: string;
}

class CreditRequestService {
  async createCreditRequest(request: Omit<CreditRequest, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>): Promise<CreditRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_requests' as any)
      .insert({
        ...request,
        user_id: user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating credit request:', error);
      throw error;
    }

    return data as CreditRequest;
  }

  async getCreditRequests(): Promise<CreditRequest[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_requests' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching credit requests:', error);
      throw error;
    }

    return (data || []) as CreditRequest[];
  }

  async getCreditAccount(): Promise<CreditAccount | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_accounts' as any)
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching credit account:', error);
      throw error;
    }

    return data as CreditAccount | null;
  }

  async updateCreditRequestStatus(id: string, status: CreditRequest['status'], reviewNotes?: string): Promise<CreditRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_requests' as any)
      .update({
        status,
        review_notes: reviewNotes,
        reviewed_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating credit request:', error);
      throw error;
    }

    return data as CreditRequest;
  }
}

export const creditRequestService = new CreditRequestService();
