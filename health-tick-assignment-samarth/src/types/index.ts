export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  callType: 'onboarding' | 'follow-up';
  date: string; 
  time: string; 
  isRecurring: boolean;
  recurringStartDate?: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export type CallType = 'onboarding' | 'follow-up';

export interface TimeSlotProps {
  time: string;
  booking?: Booking;
  onBook: (time: string) => void;
  onDelete: (bookingId: string) => void;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  selectedTime: string;
  selectedDate: string; // YYYY-MM-DD
  clients: Client[];
  existingBookings: Booking[];
  userId: string | null; // This is the added prop
  editingBooking: Booking | null;
}

export interface DateNavigationProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  bookingsCount: number;
}