
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, AlertCircle } from "lucide-react";

export interface Appointment {
  id: string;
  patientName: string;
  testType: string;
  date: string;
  time: string;
  status: string;
  priority: string;
}
interface LabAppointmentsListProps {
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
}

const LabAppointmentsList = ({ appointments, getStatusColor }: LabAppointmentsListProps) => (
  <Card className="shadow-lg border-0">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-blue-600" />
          Today's Appointments
        </CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center text-gray-400">
            No appointments for today.
          </div>
        ) : appointments.map((appointment) => (
          <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-lg">{appointment.patientName}</h4>
                <p className="text-gray-600">{appointment.testType}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
                {appointment.priority === 'urgent' && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {appointment.time}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default LabAppointmentsList;
