import { useState, useEffect, useCallback } from 'react';
import type { Booking } from '../types';
import { bookingService } from '../services/bookingService';

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  updateBooking: (booking: Booking) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

export const useBookings = (currentDate: string): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBookings = await bookingService.getBookingsForDate(currentDate);
      setBookings(fetchedBookings);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  const addBooking = useCallback(async (booking: Omit<Booking, 'id'>) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticBooking = { ...booking, id: tempId };
    
    setBookings(prev => [...prev, optimisticBooking].sort((a, b) => a.time.localeCompare(b.time)));
    
    try {
      const newBookingId = await bookingService.addBooking(booking);
      
      setBookings(prev => 
        prev.map(b => 
          b.id === tempId 
            ? { ...booking, id: newBookingId }
            : b
        )
      );
    } catch (err) {
      // Rollback optimistic update
      setBookings(prev => prev.filter(b => b.id !== tempId));
      setError('Failed to create booking');
      throw err;
    }
  }, []);

  const updateBooking = useCallback(async (updated: Booking) => {
    const oldBooking = bookings.find(b => b.id === updated.id);
    setBookings(prev =>
      prev.map(b => (b.id === updated.id ? updated : b)).sort((a, b) => a.time.localeCompare(b.time))
    );

    try {
      await bookingService.updateBooking(updated.id, {
        date: updated.date,
        time: updated.time,
        clientId: updated.clientId,
        clientName: updated.clientName,
        callType: updated.callType,
        isRecurring: updated.isRecurring,
        duration: updated.duration,
        status: updated.status
      });
    } catch (err) {
      if (oldBooking) {
        setBookings(prev =>
          prev.map(b => (b.id === oldBooking.id ? oldBooking : b)).sort((a, b) => a.time.localeCompare(b.time))
        );
      }
      setError('Failed to update booking');
      throw err;
    }
  }, [bookings]);

  const deleteBooking = useCallback(async (bookingId: string) => {
    const bookingToDelete = bookings.find(b => b.id === bookingId);
    
    // Optimistic update
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    
    try {
      await bookingService.deleteBooking(bookingId);
    } catch (err) {
      // Rollback optimistic update
      if (bookingToDelete) {
        setBookings(prev => [...prev, bookingToDelete].sort((a, b) => a.time.localeCompare(b.time)));
      }
      setError('Failed to delete booking');
      throw err;
    }
  }, [bookings]);

  /**
   * Refresh bookings manually
   */
  const refreshBookings = useCallback(async () => {
    await fetchBookings();
  }, [fetchBookings]);

  // Fetch bookings when date changes
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    addBooking,
    deleteBooking,
    refreshBookings,
    updateBooking
  };
};