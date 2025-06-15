
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, Plus, Phone, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PharmacyAppointment {
  id: string;
  user_id: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  patient_name?: string;
  patient_phone?: string;
}

const PharmacyAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<PharmacyAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchPharmacyAppointments();
    }
  }, [user]);

  const fetchPharmacyAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_user_id_fkey(name, phone)
        `)
        .eq('provider_id', user?.id)
        .eq('provider_type', 'pharmacy')
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      const appointmentsWithPatientData = data.map(apt => ({
        ...apt,
        patient_name: apt.patient?.name || 'Unknown Patient',
        patient_phone: apt.patient?.phone
      }));

      setAppointments(appointmentsWithPatientData);
    } catch (error) {
      console.error('Error fetching pharmacy appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
      ));

      toast({
        title: "Success",
        description: `Appointment ${newStatus.replace('-', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div>Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Pharmacy Appointments"
          description="Manage customer appointments and consultations"
          badge={{ text: "Pharmacy Portal", variant: "outline" }}
        />

        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        {filteredAppointments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? "No appointments match your search."
                  : "No appointments scheduled yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{appointment.service_type}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        <span>{appointment.patient_name}</span>
                        {appointment.patient_phone && (
                          <>
                            <Phone className="h-4 w-4 ml-3 mr-1" />
                            <span>{appointment.patient_phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center mb-1">
                        <FileText className="h-4 w-4 mr-1 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Notes</span>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {appointment.status === 'scheduled' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                      >
                        Start Consultation
                      </Button>
                    )}
                    {appointment.status === 'in-progress' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Reschedule
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

export default PharmacyAppointments;
