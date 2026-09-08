import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  // Output format: dd-mm-yyyy
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
}

export function formatTime(timeStr: string | Date | null | undefined): string {
  if (!timeStr) return 'N/A';
  
  // If the input is just a time string like "09:00" or "09:00:00"
  if (typeof timeStr === 'string' && timeStr.includes(':') && timeStr.length <= 8) {
    const [h, m] = timeStr.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
  }
  
  // Otherwise it's a full date string or Date object
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return 'N/A';
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
}
