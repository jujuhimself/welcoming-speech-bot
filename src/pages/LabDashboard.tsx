
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Microscope, Calendar, FileText, Users, Clock, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const LabDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingResults: 0,
    completedTests: 0,
    totalPatients: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'lab') {
      navigate('/login');
      return;
    }

    if (!user.isApproved) {
      return;
    }

    // Load lab stats - using mock data for now
    setStats({
      todayAppointments: 8,
      pendingResults: 3,
      completedTests: 45,
      totalPatients: 127
    });

    // Mock appointments data
    setAppointments([
      { id: 1, patientName: "John Doe", testType: "Blood Test", time: "09:00 AM", status: "scheduled" },
      { id: 2, patientName: "Jane Smith", testType: "X-Ray", time: "10:30 AM", status: "in-progress" },
      { id: 3, patientName: "Ahmed Ali", testType: "Ultrasound", time: "02:00 PM", status: "scheduled" },
    ]);
  }, [user, navigate]);

  if (!user || user.role !== 'lab') {
    return <div>Loading...</div>;
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Microscope className="h-16 w-16 text-yellow-500 mx-auto" />
            <p className="text-gray-600">
              Your lab account is pending admin approval. You'll receive an email notification once approved.
            </p>
            <Button onClick={logout} variant="outline">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.labName}
          </h1>
          <p className="text-gray-600 text-lg">Manage your diagnostic services and patient appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.todayAppointments}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending Results</CardTitle>
              <Clock className="h-4 w-4 text-yellow-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingResults}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Completed Tests</CardTitle>
              <Activity className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedTests}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Lab Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-24 flex-col bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/lab/appointments">
                  <Calendar className="h-8 w-8 mb-2" />
                  Manage Appointments
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/lab/tests">
                  <Microscope className="h-8 w-8 mb-2" />
                  Test Catalog
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/lab/results">
                  <FileText className="h-8 w-8 mb-2" />
                  Test Results
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col border-2 hover:bg-gray-50">
                <Link to="/lab/patients">
                  <Users className="h-8 w-8 mb-2" />
                  Patient Records
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-semibold text-lg">{appointment.patientName}</p>
                      <p className="text-gray-600">{appointment.testType}</p>
                      <p className="text-gray-600">{appointment.time}</p>
                    </div>
                    <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4" size="lg">
                  <Link to="/lab/appointments">View All Appointments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Tests */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Available Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.specializations?.map((test, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50">
                    <div>
                      <p className="font-semibold">{test}</p>
                      <p className="text-gray-600">Available daily</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4" size="lg">
                  <Link to="/lab/tests">Manage Test Catalog</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
