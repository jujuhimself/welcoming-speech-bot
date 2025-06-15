import { supabase } from '@/integrations/supabase/client';
import { auditService } from '@/services/auditService';

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

// Helper type guard to check if input is a record
function isObject<T>(input: unknown): input is T {
  return typeof input === 'object' && input !== null;
}

class CreditRequestService {
  async createCreditRequest(
    request: Omit<CreditRequest, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<CreditRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_requests')
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

    if (!isObject<CreditRequest>(data)) {
      throw new Error('No data returned from createCreditRequest');
    }

    // Audit log
    try {
      await auditService.logAction(
        'CREATE_CREDIT_REQUEST',
        'credit_request',
        data.id,
        { business_name: data.business_name, requested_amount: data.requested_amount }
      );
    } catch (e) {
      // Audit errors should not block main action.
      console.warn('Audit logging failed:', e);
    }

    return data;
  }

  async getCreditRequests(): Promise<CreditRequest[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching credit requests:', error);
      throw error;
    }

    if (!Array.isArray(data)) return [];

    // Only return correct types
    const filtered = data.filter(
      (rec): rec is CreditRequest =>
        isObject<CreditRequest>(rec) &&
        typeof rec.status === "string" &&
        ["pending", "approved", "rejected", "under_review"].includes(rec.status)
    );
    return filtered;
  }

  async getCreditAccount(): Promise<CreditAccount | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_accounts')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching credit account:', error);
      throw error;
    }

    if (!isObject<CreditAccount>(data)) {
      return null;
    }

    return data;
  }

  async updateCreditRequestStatus(
    id: string, 
    status: CreditRequest['status'], 
    reviewNotes?: string
  ): Promise<CreditRequest> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('credit_requests')
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

    if (!isObject<CreditRequest>(data)) {
      throw new Error('No data returned after status update');
    }

    return data;
  }
}

export const creditRequestService = new CreditRequestService();
