import type { Booking, CallType } from '../types';

/**
 * Generate time slots for the calendar
 */
export const generateTimeSlots = (
  startHour: number = 10,
  startMinute: number = 30,
  endHour: number = 19,
  endMinute: number = 30,
  slotDuration: number = 20
): string[] => {
  const slots: string[] = [];
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  
  for (let time = start; time < end; time += slotDuration) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    slots.push(timeStr);
  }
  
  return slots;
};

/**
 * Format time from 24-hour to 12-hour with AM/PM
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Convert time string to minutes for calculations
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Get call duration based on call type
 */
export const getCallDuration = (callType: CallType): number => {
  return callType === 'onboarding' ? 40 : 20;
};

/**
 * Check if a new booking conflicts with existing bookings
 */
export const checkTimeSlotConflict = (
  newTime: string,
  newCallType: CallType,
  existingBookings: Booking[]
): boolean => {
  const newStartMinutes = timeToMinutes(newTime);
  const newDuration = getCallDuration(newCallType);
  const newEndMinutes = newStartMinutes + newDuration;

  return existingBookings.some(booking => {
    const existingStartMinutes = timeToMinutes(booking.time);
    const existingDuration = getCallDuration(booking.callType);
    const existingEndMinutes = existingStartMinutes + existingDuration;

    // Check for overlap
    return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);
  });
};

/**
 * Get CSS classes for call type styling
 */
export const getCallTypeStyle = (callType: CallType): string => {
  switch (callType) {
    case 'onboarding':
      return 'bg-green-100 text-green-800';
    case 'follow-up':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};