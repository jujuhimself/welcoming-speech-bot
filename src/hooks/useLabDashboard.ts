
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Appointment } from '@/components/lab/LabAppointmentsList';
import type { TestResult } from '@/components/lab/LabResultsList';

export function useLabDashboard() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['labDashboardData', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated.');

      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's appointments for the lab
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today)
        .eq('provider_type', 'lab')
        .eq('provider_id', user.id);

      if (appointmentsError) throw appointmentsError;

      // Fetch patient names for these appointments
      const patientUserIds = (appointmentsData || []).map(apt => apt.user_id);
      let patientProfiles: any[] = [];
      if (patientUserIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', patientUserIds);
          if (profilesError) throw profilesError;
          patientProfiles = profilesData || [];
      }

      const profilesMap = new Map(patientProfiles.map(p => [p.id, p.name]));

      const transformedAppointments: Appointment[] = (appointmentsData || []).map((apt: any) => ({
        id: apt.id,
        patientName: profilesMap.get(apt.user_id) || 'Unknown Patient',
        testType: apt.service_type,
        date: apt.appointment_date,
        time: apt.appointment_time,
        status: apt.status,
        priority: 'normal' // priority is not in the db, keeping as-is for now
      }));
      
      // Fetch recent test results from lab_order_items for this lab
      const { data: resultsData, error: resultsError } = await supabase
        .from('lab_order_items')
        .select(`
          *,
          lab_order:lab_orders!inner(patient_name, order_date, lab_id)
        `)
        .eq('lab_order.lab_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (resultsError) {
        console.error("Error fetching lab results:", resultsError);
        throw resultsError;
      }

      const transformedResults: TestResult[] = (resultsData || []).map((result: any) => ({
        id: result.id,
        patientName: result.lab_order?.patient_name || 'Unknown Patient',
        testType: result.test_name,
        completedDate: result.result_date ? new Date(result.result_date).toLocaleDateString() : 'Pending',
        status: result.status,
        values: result.result ? { Result: result.result } : {}
      }));

      // Calculate stats
      const todayAppointments = transformedAppointments.length;
      const pendingResults = transformedResults.filter(r => r.status === 'pending').length;
      const urgentTests = transformedAppointments.filter(a => a.priority === 'urgent').length;
      const completedToday = transformedResults.filter(r => 
        r.status === 'completed' && 
        r.completedDate === new Date().toLocaleDateString()
      ).length;

      const stats = {
        todayAppointments,
        pendingResults,
        urgentTests,
        completedToday
      };

      return { stats, appointments: transformedAppointments, testResults: transformedResults };
    },
    enabled: !!user && user.role === 'lab',
  });
}
