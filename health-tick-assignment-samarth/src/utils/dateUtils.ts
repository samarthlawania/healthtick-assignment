/**
 * Format date to readable string
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Add days to a date and return in YYYY-MM-DD format
 */
export const addDays = (date: string, days: number): string => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate.toISOString().split('T')[0];
};

/**
 * Check if two dates are on the same day of the week
 */
export const isSameDayOfWeek = (date1: string, date2: string): boolean => {
  return new Date(date1).getDay() === new Date(date2).getDay();
};

/**
 * Check if date1 is after or equal to date2
 */
export const isDateAfterOrEqual = (date1: string, date2: string): boolean => {
  return new Date(date1) >= new Date(date2);
};