
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, MapPin, Plus } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location: string;
}

const Appointments = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Mwangi',
      phone: '+255 712 345 678',
      date: '2024-06-15',
      time: '09:00',
      type: 'Consultation',
      status: 'confirmed',
      location: 'Main Clinic'
    },
    {
      id: '2',
      patientName: 'Sarah Hassan',
      phone: '+255 754 987 654',
      date: '2024-06-15',
      time: '10:30',
      type: 'Lab Test',
      status: 'pending',
      location: 'Lab Wing'
    },
    {
      id: '3',
      patientName: 'David Kimani',
      phone: '+255 687 543 210',
      date: '2024-06-16',
      time: '14:00',
      type: 'Follow-up',
      status: 'confirmed',
      location: 'Room 2'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Appointments</h1>
            <p className="text-gray-600 text-lg">Manage your patient appointments</p>
          </div>
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{appointment.patientName}</h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{appointment.type}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  {appointment.status === 'pending' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Confirm
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
