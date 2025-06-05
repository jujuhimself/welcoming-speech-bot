
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== 'lab') {
      navigate('/login');
      return;
    }

    // Load sample data
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'John Mwangi',
        testType: 'Complete Blood Count',
        date: '2024-06-06',
        time: '09:00',
        status: 'scheduled',
        priority: 'normal'
      },
      {
        id: '2',
        patientName: 'Sarah Hassan',
        testType: 'Diabetes Panel',
        date: '2024-06-06',
        time: '10:30',
        status: 'in-progress',
        priority: 'urgent'
      },
      {
        id: '3',
        patientName: 'David Kimani',
        testType: 'Liver Function Test',
        date: '2024-06-06',
        time: '14:00',
        status: 'completed',
        priority: 'normal'
      }
    ];

    const sampleResults: TestResult[] = [
      {
        id: '1',
        patientName: 'Maria Santos',
        testType: 'Lipid Profile',
        completedDate: '2024-06-05',
        status: 'ready',
        values: {
          'Total Cholesterol': '180 mg/dL',
          'HDL': '45 mg/dL',
          'LDL': '120 mg/dL',
          'Triglycerides': '150 mg/dL'
        }
      },
      {
        id: '2',
        patientName: 'Peter Mushi',
        testType: 'Thyroid Function',
        completedDate: '2024-06-05',
        status: 'sent',
        values: {
          'TSH': '2.5 mIU/L',
          'T3': '150 ng/dL',
          'T4': '8.5 μg/dL'
        }
      }
    ];

    setAppointments(sampleAppointments);
    setTestResults(sampleResults);
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

  const todayAppointments = appointments.filter(apt => apt.date === '2024-06-06');
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
              <div className="text-3xl font-bold">12</div>
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
                {todayAppointments.map((appointment) => (
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
                {testResults.map((result) => (
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
                      {Object.entries(result.values).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
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
      </div>
    </div>
  );
};

export default LabDashboard;
