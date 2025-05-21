import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Appointment } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PersianDatePicker from "./PersianDatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  appointment: Appointment | null;
  isEditing: boolean;
}

// Define the form schema
const formSchema = zod.object({
  applicationDate: zod.string().min(1, { message: "تاریخ درخواست الزامی است" }),
  applicationTime: zod.string().min(1, { message: "زمان درخواست الزامی است" }),
  applicationTimePeriod: zod.string().min(1, { message: "زمان روز الزامی است" }),
  paymentDate: zod.string().min(1, { message: "تاریخ پرداخت الزامی است" }),
  appointmentDate: zod.string().optional(), // Made optional as requested
  appointmentTime: zod.string().optional(), // Made optional as requested
  appointmentTimePeriod: zod.string().optional(), // AM/PM for appointment time
});

type FormValues = zod.infer<typeof formSchema>;

export default function AppointmentForm({
  isOpen,
  onClose,
  onSubmit,
  appointment,
  isEditing,
}: AppointmentFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationDate: "",
      applicationTime: "",
      applicationTimePeriod: "AM",
      paymentDate: "",
      appointmentDate: "",
      appointmentTime: "",
      appointmentTimePeriod: "AM",
    },
  });

  // Update form when appointment changes
  useEffect(() => {
    if (appointment) {
      // Parse time to extract hours and AM/PM
      const parseTimeAndPeriod = (timeString: string | null | undefined) => {
        if (!timeString) return { time: "", period: "AM" };
        
        const timeParts = timeString.split(':');
        if (timeParts.length < 2) return { time: timeString, period: "AM" };
        
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        let period = "AM";
        
        if (hours >= 12) {
          period = "PM";
          if (hours > 12) hours -= 12;
        }
        if (hours === 0) hours = 12;
        
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        return { time: formattedTime, period };
      };
      
      const appTime = parseTimeAndPeriod(appointment.applicationTime);
      const aptTime = parseTimeAndPeriod(appointment.appointmentTime);
      
      form.reset({
        applicationDate: appointment.applicationDate,
        applicationTime: appTime.time,
        applicationTimePeriod: appTime.period,
        paymentDate: appointment.paymentDate,
        appointmentDate: appointment.appointmentDate || "",
        appointmentTime: aptTime.time,
        appointmentTimePeriod: aptTime.period,
      });
    } else {
      form.reset({
        applicationDate: "",
        applicationTime: "",
        applicationTimePeriod: "AM",
        paymentDate: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentTimePeriod: "AM",
      });
    }
  }, [appointment, form]);

  const handleSubmit = (values: FormValues) => {
    // Convert time format to include AM/PM
    const formatTimeWithPeriod = (time: string, period: string) => {
      if (!time) return "";
      
      const [hours, minutes] = time.split(':');
      let hourNum = parseInt(hours);
      
      // Convert to 24-hour format if PM
      if (period === 'PM' && hourNum < 12) {
        hourNum += 12;
      } else if (period === 'AM' && hourNum === 12) {
        hourNum = 0;
      }
      
      return `${hourNum.toString().padStart(2, '0')}:${minutes}`;
    };
    
    const applicationTime = formatTimeWithPeriod(values.applicationTime, values.applicationTimePeriod);
    const appointmentTime = values.appointmentTime ? 
      formatTimeWithPeriod(values.appointmentTime, values.appointmentTimePeriod || 'AM') : 
      "";
      
    onSubmit({
      ...values,
      applicationTime,
      appointmentTime
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "ویرایش نوبت" : "ثبت نوبت جدید"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="applicationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ درخواست</FormLabel>
                  <FormControl>
                    <PersianDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="انتخاب تاریخ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>زمان درخواست</FormLabel>
                  <div className="flex space-x-2 space-x-reverse">
                    <FormControl className="flex-1">
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name="applicationTimePeriod"
                      render={({ field: periodField }) => (
                        <FormItem className="w-20">
                          <Select
                            value={periodField.value}
                            onValueChange={periodField.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">صبح</SelectItem>
                              <SelectItem value="PM">عصر</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ پرداخت</FormLabel>
                  <FormControl>
                    <PersianDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="انتخاب تاریخ"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاریخ نوبت تعیین شده (میلادی)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      placeholder="YYYY-MM-DD"
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">لطفا تاریخ را به صورت میلادی وارد کنید</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>زمان نوبت تعیین شده</FormLabel>
                  <div className="flex space-x-2 space-x-reverse">
                    <FormControl className="flex-1">
                      <Input
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name="appointmentTimePeriod"
                      render={({ field: periodField }) => (
                        <FormItem className="w-20">
                          <Select
                            value={periodField.value || "AM"}
                            onValueChange={periodField.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">صبح</SelectItem>
                              <SelectItem value="PM">عصر</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                انصراف
              </Button>
              <Button type="submit" className="mr-2" disabled={form.formState.isSubmitting}>
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
