import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique appointment ID with APT prefix
export function generateAppointmentId(): string {
  const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `APT-${randomId}`;
}

// Format a JavaScript Date object to Persian date format (YYYY/MM/DD)
export function formatToPersianDate(date: Date): string {
  // This is a simplified implementation
  // In a real app, you'd use a proper Persian calendar library
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Convert to Persian calendar (simplified, just for demonstration)
  // In reality, this calculation is more complex
  const persianYear = year - 621;
  
  return `${persianYear}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}
