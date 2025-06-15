
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  User, 
  Heart, 
  Activity,
  Thermometer,
  Plus,
  Search,
  Download
} from "lucide-react";

interface HealthRecord {
  id: string;
  patientName: string;
  date: string;
  type: 'consultation' | 'lab-test' | 'prescription' | 'vital-signs';
  title: string;
  description: string;
  doctor: string;
  status: 'active' | 'completed' | 'pending';
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
  };
}

const HealthRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  const [records] = useState<HealthRecord[]>([
    {
      id: '1',
      patientName: 'John Mwangi',
      date: '2024-06-10',
      type: 'consultation',
      title: 'General Checkup',
      description: 'Routine health examination. Patient reports feeling well with no major concerns.',
      doctor: 'Dr. Sarah Kimani',
      status: 'completed',
    },
    {
      id: '2',
      patientName: 'Mary Hassan',
      date: '2024-06-12',
      type: 'lab-test',
      title: 'Blood Test Results',
      description: 'Complete blood count and lipid profile analysis.',
      doctor: 'Dr. James Mushi',
      status: 'completed',
    },
    {
      id: '3',
      patientName: 'David Kimani',
      date: '2024-06-14',
      type: 'vital-signs',
      title: 'Vital Signs Monitoring',
      description: 'Regular monitoring of vital signs for chronic condition management.',
      doctor: 'Nurse Grace Mlaki',
      status: 'active',
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '36.5°C',
        weight: '75 kg'
      }
    },
    {
      id: '4',
      patientName: 'Sarah Juma',
      date: '2024-06-15',
      type: 'prescription',
      title: 'Medication Prescription',
      description: 'Prescribed antibiotics for respiratory infection.',
      doctor: 'Dr. Peter Mwangi',
      status: 'active',
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-5 w-5" />;
      case 'lab-test': return <Activity className="h-5 w-5" />;
      case 'prescription': return <FileText className="h-5 w-5" />;
      case 'vital-signs': return <Heart className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'lab-test': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      case 'vital-signs': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Records</h1>
            <p className="text-gray-600 text-lg">Manage and view patient health records</p>
          </div>
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Record
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultations</option>
                <option value="lab-test">Lab Tests</option>
                <option value="prescription">Prescriptions</option>
                <option value="vital-signs">Vital Signs</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Records */}
        <div className="grid gap-6">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(record.type).replace('text-', 'text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
                      {getTypeIcon(record.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{record.title}</h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{record.patientName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{record.description}</p>
                      <p className="text-sm text-gray-600">Doctor: {record.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getTypeColor(record.type)}>
                      {record.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <br />
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Vital Signs Display */}
                {record.vitals && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Vital Signs
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {record.vitals.bloodPressure && (
                        <div>
                          <span className="text-gray-600">Blood Pressure:</span>
                          <div className="font-medium">{record.vitals.bloodPressure}</div>
                        </div>
                      )}
                      {record.vitals.heartRate && (
                        <div>
                          <span className="text-gray-600">Heart Rate:</span>
                          <div className="font-medium">{record.vitals.heartRate}</div>
                        </div>
                      )}
                      {record.vitals.temperature && (
                        <div>
                          <span className="text-gray-600">Temperature:</span>
                          <div className="font-medium">{record.vitals.temperature}</div>
                        </div>
                      )}
                      {record.vitals.weight && (
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <div className="font-medium">{record.vitals.weight}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  {record.status === 'active' && (
                    <Button size="sm">
                      Update
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedType !== 'all' 
                  ? "No records match your search criteria." 
                  : "No health records available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthRecords;
