
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import refactored components
import LabStatsCards from "@/components/lab/LabStatsCards";
import LabAppointmentsList, { Appointment } from "@/components/lab/LabAppointmentsList";
import LabResultsList, { TestResult } from "@/components/lab/LabResultsList";
import LabQuickActions from "@/components/lab/LabQuickActions";

// ... types for Appointment and TestResult are imported above

const LabDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'lab') {
      navigate('/login');
      return;
    }

    async function fetchLabData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch appointments (lab_orders) for this lab
        const { data: labOrders, error: ordersError } = await supabase
          .from('lab_orders')
          .select('*')
          .or(`lab_id.eq.${user.id},user_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(20);

        // Fetch lab_order_items for these orders (and join to test/user data)
        let testResultsArr: TestResult[] = [];
        if (labOrders && labOrders.length > 0) {
          const labOrderIds = labOrders.map(lo => lo.id);
          const { data: items, error: itemsError } = await supabase
            .from('lab_order_items')
            .select('*, lab_orders!inner(id, patient_name)')
            .in('lab_order_id', labOrderIds)
            .order('created_at', { ascending: false })
            .limit(15);

          if (itemsError) throw itemsError;

          // Map to TestResult type
          testResultsArr = (items || []).map((item: any) => ({
            id: item.id,
            patientName: item.lab_orders?.patient_name ?? "Unknown",
            testType: item.test_name,
            completedDate: item.result_date ? new Date(item.result_date).toLocaleDateString() : "",
            status: item.result ? 'ready' : 'pending',
            values: item.result
              ? (() => {
                  try { return typeof item.result === "string" ? JSON.parse(item.result) : item.result; }
                  catch { return { result: item.result }; }
                })()
              : {}
          }));
        }

        // Map appointments
        const appointmentsArr: Appointment[] = (labOrders || []).map((order: any) => ({
          id: order.id,
          patientName: order.patient_name,
          testType: order.special_instructions || "Lab Test",
          date: order.sample_collection_date
            ? new Date(order.sample_collection_date).toISOString().split('T')[0]
            : new Date(order.order_date || order.created_at).toISOString().split('T')[0],
          time: order.sample_collection_time ?? "",
          status:
            order.status === "pending"
              ? "scheduled"
              : order.status === "processing"
              ? "in-progress"
              : order.status === "completed"
              ? "completed"
              : order.status === "cancelled"
              ? "cancelled"
              : "scheduled",
          priority: (order.special_instructions?.toLowerCase().includes("urgent") ? "urgent" : "normal")
        }));

        setAppointments(appointmentsArr);
        setTestResults(testResultsArr);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load lab data. Please try again later.');
        setLoading(false);
      }
    }

    fetchLabData();
  }, [user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'ready': return 'bg-purple-100 text-purple-800';
      case 'sent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Today's date in ISO format for filtering
  const todayDate = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === todayDate);
  const pendingResults = testResults.filter(result => result.status === 'ready');
  const urgentTests = appointments.filter(apt => apt.priority === 'urgent');
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Laboratory Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back, {user?.name}! Manage tests, appointments, and results.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-orange-600 hover:bg-orange-700">
              {/* ... */}
              New Appointment
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              {/* ... */}
              Add Test Result
            </Button>
          </div>
        </div>
        {/* Loading/Error State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Clock className="animate-spin h-8 w-8 text-orange-400 mr-2" />
            <span className="text-lg text-orange-600">Loading laboratory data...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <AlertCircle className="h-8 w-8 text-red-400 mr-2" />
            <span className="text-lg text-red-600">{error}</span>
          </div>
        ) : (
        <>
          <LabStatsCards
            todayAppointmentsCount={todayAppointments.length}
            pendingResultsCount={pendingResults.length}
            urgentTestsCount={urgentTests.length}
            completedTodayCount={completedToday.length}
          />
          <div className="grid lg:grid-cols-2 gap-8">
            <LabAppointmentsList
              appointments={todayAppointments}
              getStatusColor={getStatusColor}
            />
            <LabResultsList
              testResults={testResults}
              getStatusColor={getStatusColor}
            />
          </div>
          <LabQuickActions />
        </>
        )}
      </div>
    </div>
  );
};

export default LabDashboard;
