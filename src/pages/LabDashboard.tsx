
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Microscope, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  patientName: string;
  testType: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
}

interface TestResult {
  id: string;
  patientName: string;
  testType: string;
  completedDate: string;
  status: 'pending' | 'ready' | 'sent';
  values: { [key: string]: string };
}

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
                  // Try to parse result JSON if possible
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
              <Plus className="h-5 w-5 mr-2" />
              New Appointment
            </Button>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <FileText className="h-5 w-5 mr-2" />
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayAppointments.length}</div>
              <div className="flex items-center mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm text-blue-100">Scheduled tests</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Pending Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingResults.length}</div>
              <div className="flex items-center mt-2">
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-sm text-purple-100">Ready to send</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Urgent Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{urgentTests.length}</div>
              <div className="flex items-center mt-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm text-red-100">Priority cases</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Count completed appointments for today */}
              <div className="text-3xl font-bold">
                {todayAppointments.filter(apt => apt.status === 'completed').length}
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-sm text-green-100">Tests finished</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Today's Appointments
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <div className="text-center text-gray-400">
                    No appointments for today.
                  </div>
                ) : todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{appointment.patientName}</h4>
                        <p className="text-gray-600">{appointment.testType}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.priority === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-purple-600" />
                  Recent Test Results
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.length === 0 ? (
                  <div className="text-center text-gray-400">No test results available.</div>
                ) : testResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{result.patientName}</h4>
                        <p className="text-gray-600">{result.testType}</p>
                        <p className="text-sm text-gray-500">Completed: {result.completedDate}</p>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {/* Show up to 2 test result values if available */}
                      {Object.entries(result.values).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {result.status === 'ready' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Send Results
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Test
              </Button>
              <Button className="h-20 flex-col bg-purple-600 hover:bg-purple-700">
                <Microscope className="h-6 w-6 mb-2" />
                Lab Equipment
              </Button>
              <Button className="h-20 flex-col bg-green-600 hover:bg-green-700">
                <FileText className="h-6 w-6 mb-2" />
                Patient Records
              </Button>
              <Button className="h-20 flex-col bg-orange-600 hover:bg-orange-700">
                <TrendingUp className="h-6 w-6 mb-2" />
                Lab Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </div>
  );
};

export default LabDashboard;

