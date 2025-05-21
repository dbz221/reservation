import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Appointment } from "@shared/schema";

interface AppointmentRowProps {
  appointment: Appointment;
  onEditClick: (uniqueId: string) => void;
}

export default function AppointmentRow({ appointment, onEditClick }: AppointmentRowProps) {
  // Create a masked ID to hide the actual uniqueId from users
  const maskedId = "****-" + appointment.uniqueId.substring(appointment.uniqueId.length - 4);
  
  // Format time to display with AM/PM
  const formatTimeWithAMPM = (timeString: string | null | undefined) => {
    if (!timeString) return "";
    
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours);
    
    if (hourNum >= 12) {
      return `${hourNum === 12 ? 12 : hourNum - 12}:${minutes} PM`;
    } else {
      return `${hourNum === 0 ? 12 : hourNum}:${minutes} AM`;
    }
  };
  
  return (
    <TableRow key={appointment.uniqueId}>
      <TableCell className="font-medium text-right">{maskedId}</TableCell>
      <TableCell className="text-right">{appointment.applicationDate}</TableCell>
      <TableCell className="text-right">{formatTimeWithAMPM(appointment.applicationTime)}</TableCell>
      <TableCell className="text-right">{appointment.paymentDate}</TableCell>
      <TableCell className="text-right">{appointment.appointmentDate || "تعیین نشده"}</TableCell>
      <TableCell className="text-right">{appointment.appointmentTime ? formatTimeWithAMPM(appointment.appointmentTime) : "تعیین نشده"}</TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary hover:text-primary/90 hover:bg-primary/10"
          onClick={() => onEditClick("")}
        >
          <Edit className="ml-2 h-4 w-4" />
          ویرایش با کد
        </Button>
      </TableCell>
    </TableRow>
  );
}
