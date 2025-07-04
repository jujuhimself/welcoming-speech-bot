import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Plus, Filter, CreditCard } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PharmacyAppointmentScheduler from "@/components/pharmacy/PharmacyAppointmentScheduler";

interface PharmacyAppointment {
  id: string;
  user_id: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  patient_name: string;
  patient_phone?: string;
}

const PharmacyAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<PharmacyAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('provider_type', 'pharmacy')
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Transform the data to match our interface
      const typedAppointments: PharmacyAppointment[] = (data || []).map(apt => ({
        id: apt.id,
        user_id: apt.user_id,
        service_type: apt.service_type,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        status: apt.status as 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled',
        notes: apt.notes || undefined,
        patient_name: 'Patient Name', // Will need proper patient data
        patient_phone: 'Patient Phone' // Will need proper patient data
      }));

      setAppointments(typedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
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

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div>Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Pharmacy Appointments"
          description="Manage pharmacy service appointments"
          badge={{ text: "Pharmacy Portal", variant: "outline" }}
        />

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'scheduled' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('scheduled')}
            >
              Scheduled
            </Button>
            <Button 
              variant={filter === 'confirmed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </Button>
            <Button 
              variant={filter === 'completed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
          <Button onClick={() => setShowScheduler(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        <PharmacyAppointmentScheduler
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
          onAppointmentCreated={fetchAppointments}
        />

        {filteredAppointments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "No pharmacy appointments scheduled."
                  : `No ${filter} appointments found.`
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
                      </div>
                      {appointment.patient_phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{appointment.patient_phone}</span>
                        </div>
                      )}
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
                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Checkout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Appointments:</span>
                <span>{filteredAppointments.length}</span>
              </div>
              <Button
                className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 text-white text-lg py-3"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/create-checkout-session", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amount: filteredAppointments.length * 1000, // Example: $10 per appointment
                        currency: "usd",
                        productName: `Pharmacy Appointments for ${user?.email}`,
                        success_url: window.location.origin + "/checkout-success",
                        cancel_url: window.location.origin + "/pharmacy/appointments",
                      }),
                    });
                    const data = await response.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      throw new Error(data.error || "Failed to create checkout session");
                    }
                  } catch (err) {
                    toast({
                      title: "Checkout Error",
                      description: err.message || "Could not start checkout.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={filteredAppointments.length === 0}
              >
                <CreditCard className="h-5 w-5" />
                Checkout with Stripe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PharmacyAppointments;
