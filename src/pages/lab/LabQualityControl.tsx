
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertTriangle, CheckCircle, Clock, Plus, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";

interface QualityControlCheck {
  id: string;
  test_name: string;
  check_type: 'calibration' | 'control_sample' | 'maintenance' | 'validation';
  status: 'pending' | 'in_progress' | 'passed' | 'failed';
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  technician: string;
}

const LabQualityControl = () => {
  const [checks] = useState<QualityControlCheck[]>([
    {
      id: '1',
      test_name: 'Blood Glucose Test',
      check_type: 'calibration',
      status: 'pending',
      scheduled_date: '2024-01-15',
      technician: 'Dr. Smith'
    },
    {
      id: '2',
      test_name: 'Complete Blood Count',
      check_type: 'control_sample',
      status: 'passed',
      scheduled_date: '2024-01-14',
      completed_date: '2024-01-14',
      notes: 'All control samples within acceptable range',
      technician: 'Lab Tech A'
    },
    {
      id: '3',
      test_name: 'Chemistry Analyzer',
      check_type: 'maintenance',
      status: 'in_progress',
      scheduled_date: '2024-01-16',
      technician: 'Maintenance Team'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCheckTypeColor = (type: string) => {
    switch (type) {
      case 'calibration': return 'bg-purple-100 text-purple-800';
      case 'control_sample': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'validation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Quality Control"
          description="Monitor and manage quality control procedures"
          badge={{ text: "Lab Portal", variant: "outline" }}
        />

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Checks</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {checks.filter(c => c.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {checks.filter(c => c.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Passed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {checks.filter(c => c.status === 'passed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {checks.filter(c => c.status === 'failed').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Quality Control Checks</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Check
          </Button>
        </div>

        <div className="grid gap-4">
          {checks.map((check) => (
            <Card key={check.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{check.test_name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCheckTypeColor(check.check_type)}>
                        {check.check_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Assigned to: {check.technician}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(check.status)}
                      {check.status.replace('_', ' ')}
                    </div>
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Scheduled Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(check.scheduled_date).toLocaleDateString()}
                    </p>
                  </div>
                  {check.completed_date && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Completed Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(check.completed_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {check.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                    <p className="text-sm text-gray-600">{check.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {check.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      Start Check
                    </Button>
                  )}
                  {check.status === 'in_progress' && (
                    <>
                      <Button variant="outline" size="sm">
                        Mark as Passed
                      </Button>
                      <Button variant="outline" size="sm">
                        Mark as Failed
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabQualityControl;
