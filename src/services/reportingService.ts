
import { supabase } from '@/integrations/supabase/client';

export interface ReportTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  report_type: 'sales' | 'inventory' | 'financial' | 'custom';
  query_config: Record<string, any>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    day_of_week?: number;
    day_of_month?: number;
    time: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedReport {
  id: string;
  template_id: string;
  file_path: string;
  file_format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  parameters?: Record<string, any>;
}

class ReportingService {
  async getReportTemplates(): Promise<ReportTemplate[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }

    return data || [];
  }

  async createReportTemplate(template: Omit<ReportTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ReportTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('report_templates')
      .insert({
        ...template,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report template:', error);
      throw error;
    }

    return data;
  }

  async generateReport(templateId: string, parameters?: Record<string, any>): Promise<GeneratedReport> {
    const { data, error } = await supabase
      .from('generated_reports')
      .insert({
        template_id: templateId,
        file_format: 'pdf',
        status: 'generating',
        parameters
      })
      .select()
      .single();

    if (error) {
      console.error('Error generating report:', error);
      throw error;
    }

    return data;
  }

  async getGeneratedReports(): Promise<GeneratedReport[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('generated_reports')
      .select(`
        *,
        report_templates!inner(user_id)
      `)
      .eq('report_templates.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching generated reports:', error);
      throw error;
    }

    return data || [];
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from('reports')
      .download(`report_${reportId}.pdf`);

    if (error) {
      console.error('Error downloading report:', error);
      throw error;
    }

    return data;
  }
}

export const reportingService = new ReportingService();
