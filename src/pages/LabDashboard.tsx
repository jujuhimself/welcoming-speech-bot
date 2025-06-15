import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LabStatsCards from "@/components/lab/LabStatsCards";
import LabAppointmentsList from "@/components/lab/LabAppointmentsList";
import LabResultsList from "@/components/lab/LabResultsList";
import LabQuickActions from "@/components/lab/LabQuickActions";
import type { Appointment } from "@/components/lab/LabAppointmentsList";
import type { TestResult } from "@/components/lab/LabResultsList";

const LabDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingResults: 0,
    urgentTests: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today)
        .eq('provider_type', 'lab');

      if (appointmentsError) throw appointmentsError;

      // Transform appointments data
      const transformedAppointments: Appointment[] = (appointmentsData || []).map(apt => ({
        id: apt.id,
        patientName: 'Patient', // We don't have patient name in appointments table
        testType: apt.service_type,
        date: apt.appointment_date,
        time: apt.appointment_time,
        status: apt.status,
        priority: 'normal' // Default priority
      }));

      // Fetch recent test results from lab_order_items
      const { data: resultsData, error: resultsError } = await supabase
        .from('lab_order_items')
        .select(`
          *,
          lab_order:lab_orders(patient_name, order_date)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (resultsError) throw resultsError;

      // Transform test results data
      const transformedResults: TestResult[] = (resultsData || []).map(result => ({
        id: result.id,
        patientName: (result.lab_order as any)?.patient_name || 'Unknown Patient',
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

      setAppointments(transformedAppointments);
      setTestResults(transformedResults);
      setStats({
        todayAppointments,
        pendingResults,
        urgentTests,
        completedToday
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Could not load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-purple-100 text-purple-800',
      confirmed: 'bg-green-100 text-green-800',
      ready: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Laboratory Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your laboratory operations efficiently</p>
        </div>

        <LabStatsCards
          todayAppointmentsCount={stats.todayAppointments}
          pendingResultsCount={stats.pendingResults}
          urgentTestsCount={stats.urgentTests}
          completedTodayCount={stats.completedToday}
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <LabAppointmentsList 
            appointments={appointments}
            getStatusColor={getStatusColor}
          />
          <LabResultsList 
            testResults={testResults}
            getStatusColor={getStatusColor}
          />
        </div>

        <LabQuickActions />
      </div>
    </div>
  );
};

export default LabDashboard;
