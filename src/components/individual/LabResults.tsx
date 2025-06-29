import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, TestTube, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LabAppointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  status: string;
  notes?: string;
  created_at: string;
  provider_id: string;
}

interface LabResultsProps {
  labAppointments: LabAppointment[];
}

const LabResults = ({ labAppointments }: LabResultsProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Show HH:MM format
  };

  const hasResults = (notes?: string) => {
    return notes && notes.includes('Result:');
  };

  const extractResult = (notes?: string) => {
    if (!notes) return '';
    const resultMatch = notes.match(/Result:\s*(.+?)(?:\n|$)/);
    return resultMatch ? resultMatch[1] : '';
  };

  const extractFileUrl = (notes?: string) => {
    if (!notes) return '';
    const fileMatch = notes.match(/File uploaded:\s*(.+?)(?:\n|$)/);
    return fileMatch ? fileMatch[1] : '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Lab Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">Loading lab results...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Lab Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {labAppointments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No lab appointments found.
          </div>
        ) : (
          <div className="space-y-3">
            {labAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
                    {appointment.appointment_time && (
                      <>
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{formatTime(appointment.appointment_time)}</span>
                      </>
                    )}
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Test:</strong> {appointment.service_type}
                </div>
                {hasResults(appointment.notes) && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-green-800 mb-1">Results Available</div>
                        <div className="text-sm text-green-700">
                          {extractResult(appointment.notes)}
                        </div>
                        {extractFileUrl(appointment.notes) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.open(extractFileUrl(appointment.notes), '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {appointment.notes && !hasResults(appointment.notes) && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <div className="flex items-start gap-1">
                      <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{appointment.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LabResults; 