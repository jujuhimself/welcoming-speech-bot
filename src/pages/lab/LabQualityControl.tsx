import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle, AlertTriangle, Search, Plus, Calendar } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";

interface QualityControlCheck {
  id: string;
  equipment_name: string;
  check_type: 'daily' | 'weekly' | 'monthly' | 'calibration';
  status: 'passed' | 'failed' | 'pending';
  checked_by: string;
  check_date: string;
  next_check_date: string;
  notes?: string;
}

const LabQualityControl = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [checks, setChecks] = useState<QualityControlCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data for quality control checks
    const mockChecks: QualityControlCheck[] = [
      {
        id: '1',
        equipment_name: 'Hematology Analyzer',
        check_type: 'daily',
        status: 'passed',
        checked_by: 'Lab Tech A',
        check_date: '2024-01-15',
        next_check_date: '2024-01-16',
        notes: 'All parameters within normal range'
      },
      {
        id: '2',
        equipment_name: 'Chemistry Analyzer',
        check_type: 'calibration',
        status: 'pending',
        checked_by: 'Lab Tech B',
        check_date: '2024-01-14',
        next_check_date: '2024-01-21',
        notes: 'Requires calibration verification'
      },
      {
        id: '3',
        equipment_name: 'Microscope Unit 1',
        check_type: 'weekly',
        status: 'failed',
        checked_by: 'Lab Tech C',
        check_date: '2024-01-13',
        next_check_date: '2024-01-20',
        notes: 'Light source needs replacement'
      }
    ];
    
    setChecks(mockChecks);
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCheckTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-purple-100 text-purple-800';
      case 'monthly': return 'bg-indigo-100 text-indigo-800';
      case 'calibration': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChecks = checks.filter(check =>
    check.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.checked_by.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div>Loading quality control data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Quality Control"
          description="Monitor and manage laboratory quality control checks"
          badge={{ text: "Lab Portal", variant: "outline" }}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search equipment or technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New QC Check
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Passed</p>
                  <p className="text-xl font-bold text-green-600">
                    {checks.filter(c => c.status === 'passed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-xl font-bold text-red-600">
                    {checks.filter(c => c.status === 'failed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {checks.filter(c => c.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Checks</p>
                  <p className="text-xl font-bold text-blue-600">{checks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredChecks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quality control checks found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No checks match your search." : "No quality control checks available."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredChecks.map((check) => (
              <Card key={check.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{check.equipment_name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCheckTypeColor(check.check_type)}>
                          {check.check_type}
                        </Badge>
                        <Badge className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Checked by: {check.checked_by}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Last Check: {new Date(check.check_date).toLocaleDateString()}</div>
                      <div>Next Check: {new Date(check.next_check_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {check.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm text-gray-700">{check.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Check
                    </Button>
                    <Button variant="outline" size="sm">
                      Schedule Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabQualityControl;
