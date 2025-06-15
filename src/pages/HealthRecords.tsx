import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, FileText, TestTube, Calendar, Shield, Activity, Plus, Search, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HealthRecord {
  id: string;
  record_type: 'prescription' | 'lab_result' | 'appointment' | 'vaccination' | 'allergy' | 'condition';
  title: string;
  description?: string;
  date_recorded: string;
  provider_name?: string;
  attachments: any[];
  metadata: any;
}

const HealthRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchHealthRecords();
    }
  }, [user]);

  const fetchHealthRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('date_recorded', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const typedRecords: HealthRecord[] = (data || []).map(record => ({
        id: record.id,
        record_type: record.record_type as 'prescription' | 'lab_result' | 'appointment' | 'vaccination' | 'allergy' | 'condition',
        title: record.title,
        description: record.description || undefined,
        date_recorded: record.date_recorded,
        provider_name: record.provider_name || undefined,
        attachments: Array.isArray(record.attachments) ? record.attachments : [],
        metadata: record.metadata || {}
      }));
      
      setRecords(typedRecords);
    } catch (error) {
      console.error('Error fetching health records:', error);
      toast({
        title: "Error",
        description: "Failed to load health records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <FileText className="h-5 w-5" />;
      case 'lab_result': return <TestTube className="h-5 w-5" />;
      case 'appointment': return <Calendar className="h-5 w-5" />;
      case 'vaccination': return <Shield className="h-5 w-5" />;
      case 'allergy': return <Activity className="h-5 w-5" />;
      case 'condition': return <Heart className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'lab_result': return 'bg-green-100 text-green-800';
      case 'appointment': return 'bg-purple-100 text-purple-800';
      case 'vaccination': return 'bg-yellow-100 text-yellow-800';
      case 'allergy': return 'bg-red-100 text-red-800';
      case 'condition': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.provider_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || record.record_type === filter;
    return matchesSearch && matchesFilter;
  });

  const recordTypes = ['prescription', 'lab_result', 'appointment', 'vaccination', 'allergy', 'condition'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div>Loading health records...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Health Records"
          description="Your complete health history in one place"
          badge={{ text: "Patient Portal", variant: "outline" }}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            {recordTypes.map(type => (
              <Button 
                key={type}
                variant={filter === type ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>

        {filteredRecords.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No health records found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filter !== 'all' 
                  ? "No records match your current search or filter."
                  : "Start building your health history by adding your first record."
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getRecordIcon(record.record_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{record.title}</h3>
                        {record.provider_name && (
                          <p className="text-gray-600 text-sm mb-2">
                            Provider: {record.provider_name}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm">
                          {new Date(record.date_recorded).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRecordColor(record.record_type)}>
                      {record.record_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {record.description && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{record.description}</p>
                    </div>
                  )}

                  {record.attachments && record.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {record.attachments.length} attachment(s)
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
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

export default HealthRecords;
