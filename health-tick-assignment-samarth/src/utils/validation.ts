import type { Booking } from '../types';

/**
 * Validate booking data
 */
export const validateBooking = (booking: Partial<Booking>): string[] => {
  const errors: string[] = [];
  
  if (!booking.clientId) errors.push('Client is required');
  if (!booking.date) errors.push('Date is required');
  if (!booking.time) errors.push('Time is required');
  if (!booking.callType) errors.push('Call type is required');
  
  // Validate time format (HH:MM)
  if (booking.time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(booking.time)) {
    errors.push('Invalid time format');
  }
  
  // Validate date format (YYYY-MM-DD)
  if (booking.date && !/^\d{4}-\d{2}-\d{2}$/.test(booking.date)) {
    errors.push('Invalid date format');
  }
  
  return errors;
};

/**
 * Validate client phone number
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};