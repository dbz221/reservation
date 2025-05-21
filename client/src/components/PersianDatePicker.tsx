import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PersianDatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Simple Persian (Jalali) calendar implementation
export default function PersianDatePicker({
  id,
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  className,
}: PersianDatePickerProps) {
  const [open, setOpen] = useState(false);
  
  // Current view for the calendar
  const [viewDate, setViewDate] = useState(() => {
    // Default to current Persian date if no value is provided
    const today = new Date();
    return {
      year: today.getFullYear() - 621, // Approximate conversion to Persian year
      month: today.getMonth() + 1
    };
  });

  // Persian month names
  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  // Persian weekday names
  const persianWeekdays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  // Get days in month (simplified for this example)
  const getDaysInMonth = (year: number, month: number) => {
    // Persian calendar month days (simplified)
    const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    // Add leap year logic for Esfand
    if (month === 12) {
      // Very simplified leap year calculation
      if ((year + 621) % 4 === 0) {
        return 30;
      }
    }
    return monthDays[month - 1];
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    setViewDate(prev => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 12 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setViewDate(prev => {
      if (prev.month === 12) {
        return { year: prev.year + 1, month: 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    const formattedDate = `${viewDate.year}/${String(viewDate.month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
    setOpen(false);
  };

  // Parse date from string format (YYYY/MM/DD)
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]),
      day: parseInt(parts[2])
    };
  };

  const selectedDate = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn("pr-4 pl-10", className)}
            onClick={() => setOpen(true)}
          />
          <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-center font-medium">
              {persianMonths[viewDate.month - 1]} {viewDate.year}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Weekdays header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {persianWeekdays.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day) => {
              const isSelected = 
                selectedDate && 
                selectedDate.year === viewDate.year && 
                selectedDate.month === viewDate.month && 
                selectedDate.day === day;
                
              return (
                <div
                  key={day}
                  className={cn(
                    "text-center py-1.5 rounded-md text-sm cursor-pointer hover:bg-muted",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                  onClick={() => handleDateSelect(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
