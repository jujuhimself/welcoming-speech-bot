import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, CheckCircle, AlertCircle, Clock, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/services/storageService";
import { supabase } from "@/integrations/supabase/client";
import PatientSearch, { Patient } from "./PatientSearch";

interface LabResult {
  id: string;
  patient_id: string;
  patient_name: string;
  test_type: string;
  result_data: any;
  result_file_url?: string;
  status: "draft" | "review" | "final" | "approved";
  created_at: string;
  notes?: string;
}

interface ResultTemplate {
  id: string;
  name: string;
  test_type: string;
  fields: Array<{
    name: string;
    type: "text" | "number" | "select";
    label: string;
    unit?: string;
    normal_range?: string;
  }>;
}

const resultTemplates: ResultTemplate[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    test_type: "Hematology",
    fields: [
      { name: "wbc", type: "number", label: "White Blood Cells", unit: "K/µL", normal_range: "4.5-11.0" },
      { name: "rbc", type: "number", label: "Red Blood Cells", unit: "M/µL", normal_range: "4.5-5.9" },
      { name: "hemoglobin", type: "number", label: "Hemoglobin", unit: "g/dL", normal_range: "13.5-17.5" },
    ]
  },
  {
    id: "2",
    name: "Comprehensive Metabolic Panel",
    test_type: "Chemistry",
    fields: [
      { name: "glucose", type: "number", label: "Glucose", unit: "mg/dL", normal_range: "70-100" },
      { name: "creatinine", type: "number", label: "Creatinine", unit: "mg/dL", normal_range: "0.7-1.3" },
      { name: "sodium", type: "number", label: "Sodium", unit: "mEq/L", normal_range: "135-145" },
    ]
  }
];

const LabResultsManager = () => {
  const [results, setResults] = useState<LabResult[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResultTemplate | null>(null);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('lab_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        title: "Error",
        description: "Failed to load lab results",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: ResultTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setShowResultForm(true);
  };

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResultFile(file);
  };

  const handleSubmitResult = async () => {
    if (!selectedPatient || !selectedTemplate) return;

    setIsSubmitting(true);
    try {
      let fileUrl = null;
      if (resultFile) {
        const { publicUrl } = await uploadFile({
          file: resultFile,
          userId: selectedPatient.id,
          bucket: "lab-results",
        });
        fileUrl = publicUrl;
      }

      const resultData = {
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.full_name || selectedPatient.email,
        test_type: selectedTemplate.name,
        result_data: formData,
        result_file_url: fileUrl,
        status: "draft",
        created_by: "lab",
        notes: formData.notes || ""
      };

      const { error } = await supabase
        .from('lab_results')
        .insert(resultData);

      if (error) throw error;

      toast({
        title: "Result Created",
        description: "Lab result has been created successfully.",
      });

      setShowResultForm(false);
      setSelectedTemplate(null);
      setFormData({});
      setResultFile(null);
      fetchResults();
    } catch (error) {
      console.error("Error creating result:", error);
      toast({
        title: "Error",
        description: "Failed to create lab result",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedResults.length === 0) return;

    try {
      const { error } = await supabase
        .from('lab_results')
        .update({ status })
        .in('id', selectedResults);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Updated ${selectedResults.length} result(s) to ${status}`,
      });

      setSelectedResults([]);
      fetchResults();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update results",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      final: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <FileText className="h-4 w-4" />;
      case "review": return <Clock className="h-4 w-4" />;
      case "final": return <CheckCircle className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lab Results Management</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Result Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resultTemplates.map(template => (
                <div
                  key={template.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.test_type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientSearch
              onPatientSelect={setSelectedPatient}
              selectedPatient={selectedPatient}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.slice(0, 5).map(result => (
                <div
                  key={result.id}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{result.patient_name}</p>
                      <p className="text-xs text-gray-600">{result.test_type}</p>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Results</CardTitle>
            {selectedResults.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate("review")}
                >
                  Mark for Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate("approved")}
                >
                  Approve Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedResults.length === results.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedResults(results.map(r => r.id));
                      } else {
                        setSelectedResults([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map(result => (
                <TableRow key={result.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedResults.includes(result.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedResults(prev => [...prev, result.id]);
                        } else {
                          setSelectedResults(prev => prev.filter(id => id !== result.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{result.patient_name}</TableCell>
                  <TableCell>{result.test_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                      <span className="ml-1">{result.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(result.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResult(result)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {result.result_file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.result_file_url, '_blank')}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showResultForm} onOpenChange={setShowResultForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Lab Result - {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {selectedTemplate.fields.map(field => (
                  <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type}
                      placeholder={field.label}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                    />
                    {field.unit && (
                      <p className="text-xs text-gray-500">Unit: {field.unit}</p>
                    )}
                    {field.normal_range && (
                      <p className="text-xs text-gray-500">Normal: {field.normal_range}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Result File (Optional)</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={formData.notes || ""}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResultForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitResult} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Result"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Result Details</DialogTitle>
          </DialogHeader>
          
          {selectedResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient</Label>
                  <p className="text-gray-600">{selectedResult.patient_name}</p>
                </div>
                <div>
                  <Label>Test Type</Label>
                  <p className="text-gray-600">{selectedResult.test_type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedResult.status)}>
                    {selectedResult.status}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-gray-600">{format(new Date(selectedResult.created_at), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              {selectedResult.result_data && (
                <div>
                  <Label>Results</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <pre className="text-sm">{JSON.stringify(selectedResult.result_data, null, 2)}</pre>
                  </div>
                </div>
              )}

              {selectedResult.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-gray-600">{selectedResult.notes}</p>
                </div>
              )}

              {selectedResult.result_file_url && (
                <div>
                  <Label>Attached File</Label>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedResult.result_file_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabResultsManager; 