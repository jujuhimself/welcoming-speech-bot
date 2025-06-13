
import { supabase } from '@/integrations/supabase/client';

export interface Prescription {
  id: string;
  user_id: string;
  patient_name: string;
  patient_phone?: string;
  doctor_name: string;
  doctor_license?: string;
  prescription_date: string;
  diagnosis?: string;
  instructions?: string;
  status: 'pending' | 'verified' | 'dispensed' | 'completed' | 'cancelled';
  pharmacy_id?: string;
  verified_by?: string;
  verified_at?: string;
  dispensed_by?: string;
  dispensed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unit: string;
  special_instructions?: string;
  product_id?: string;
  dispensed_quantity: number;
  created_at: string;
}

class PrescriptionService {
  async getPrescriptions(): Promise<Prescription[]> {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }

    return (data || []).map(prescription => ({
      ...prescription,
      status: prescription.status as Prescription['status']
    }));
  }

  async createPrescription(prescription: Omit<Prescription, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Prescription> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        ...prescription,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Prescription['status']
    };
  }

  async getPrescriptionItems(prescriptionId: string): Promise<PrescriptionItem[]> {
    const { data, error } = await supabase
      .from('prescription_items')
      .select('*')
      .eq('prescription_id', prescriptionId)
      .order('created_at');

    if (error) {
      console.error('Error fetching prescription items:', error);
      throw error;
    }

    return data || [];
  }

  async createPrescriptionItem(item: Omit<PrescriptionItem, 'id' | 'created_at'>): Promise<PrescriptionItem> {
    const { data, error } = await supabase
      .from('prescription_items')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating prescription item:', error);
      throw error;
    }

    return data;
  }

  async updatePrescriptionStatus(id: string, status: Prescription['status']): Promise<Prescription> {
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }

    return {
      ...data,
      status: data.status as Prescription['status']
    };
  }
}

export const prescriptionService = new PrescriptionService();
