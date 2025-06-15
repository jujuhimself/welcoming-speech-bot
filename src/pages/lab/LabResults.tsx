
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TestTube, Search, Upload, Download, Eye, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LabOrderItem {
  id: string;
  lab_order_id: string;
  test_name: string;
  test_price: number;
  status: 'pending' | 'processing' | 'completed';
  result?: string;
  result_date?: string;
  patient_name?: string;
  order_date?: string;
}

const LabResults = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [labResults, setLabResults] = useState<LabOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchLabResults();
    }
  }, [user]);

  const fetchLabResults = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_order_items')
        .select(`
          *,
          lab_order:lab_orders!lab_order_items_lab_order_id_fkey(
            patient_name,
            order_date,
            lab_id
          )
        `)
        .eq('lab_order.lab_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const resultsWithPatientData = data
        .filter(item => item.lab_order?.lab_id === user?.id)
        .map(item => ({
          ...item,
          patient_name: item.lab_order?.patient_name || 'Unknown Patient',
          order_date: item.lab_order?.order_date
        }));

      setLabResults(resultsWithPatientData);
    } catch (error) {
      console.error('Error fetching lab results:', error);
      toast({
        title: "Error",
        description: "Failed to load lab results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateResultStatus = async (itemId: string, newStatus: string, result?: string) => {
    try {
      const updateData: any = { 
        status: newStatus
      };
      
      if (result) {
        updateData.result = result;
        updateData.result_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('lab_order_items')
        .update(updateData)
        .eq('id', itemId);

      if (error) throw error;

      setLabResults(prev => prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: newStatus as any, 
          result: result || item.result,
          result_date: result ? new Date().toISOString() : item.result_date
        } : item
      ));

      toast({
        title: "Success",
        description: `Test result ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating result:', error);
      toast({
        title: "Error",
        description: "Failed to update result",
        variant: "destructive",
      });
    }
  };

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.patient_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || result.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div>Loading lab results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Results Management"
          description="Manage test results and reporting"
          badge={{ text: "Lab Portal", variant: "outline" }}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by test name or patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === 'processing' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('processing')}
            >
              Processing
            </Button>
            <Button 
              variant={statusFilter === 'completed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test results found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? "No results match your current search or filter."
                  : "No test results to manage yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{result.test_name}</h3>
                      <p className="text-gray-600 text-sm mb-1">
                        Patient: {result.patient_name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Order Date: {result.order_date ? new Date(result.order_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>

                  {result.result && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Test Result</span>
                      </div>
                      <p className="text-sm text-green-700">{result.result}</p>
                      {result.result_date && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed: {new Date(result.result_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Price: TZS {result.test_price.toLocaleString()}
                    </div>
                    
                    <div className="flex gap-2">
                      {result.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateResultStatus(result.id, 'processing')}
                        >
                          Start Processing
                        </Button>
                      )}
                      {result.status === 'processing' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // In a real app, this would open a form to enter results
                            const result_text = prompt('Enter test result:');
                            if (result_text) {
                              updateResultStatus(result.id, 'completed', result_text);
                            }
                          }}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload Result
                        </Button>
                      )}
                      {result.status === 'completed' && result.result && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
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

export default LabResults;
