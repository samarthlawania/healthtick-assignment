import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Booking, Client } from '../types';
import { mockClients } from '../data/mockClients';
import { isSameDayOfWeek, isDateAfterOrEqual } from '../utils/dateUtils';

/**
 * BookingService handles all Firebase operations
 */
export class BookingService {
  private bookingsCollection = collection(db, 'bookings');
//   private clientsCollection = collection(db, 'clients');

  /**
   * Get all clients (mock data for demo)
   */
  async getClients(): Promise<Client[]> {
    // In production, fetch from Firebase:
    // const snapshot = await getDocs(this.clientsCollection);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    
    return Promise.resolve(mockClients);
  }

  /**
   * Add a new booking
   */
  async addBooking(booking: Omit<Booking, 'id'>): Promise<string> {
    const bookingWithTimestamp = {
      ...booking,
      duration: booking.callType === 'onboarding' ? 40 : 20,
      status: 'scheduled' as const,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    };
    console.log('Adding booking:', bookingWithTimestamp);

    const docRef = await addDoc(this.bookingsCollection, bookingWithTimestamp);
    return docRef.id;
  }

  /**
   * Delete a booking
   */
  async deleteBooking(bookingId: string): Promise<void> {
    const bookingDoc = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingDoc);
  }

  /**
   * Get bookings for a specific date (including recurring)
   */
  async getBookingsForDate(date: string): Promise<Booking[]> {
    try {
      // Get direct bookings for the specific date
      const directQuery = query(
        this.bookingsCollection,
        where('date', '==', date),
        orderBy('time', 'asc')
      );
      const directSnapshot = await getDocs(directQuery);
      const directBookings = directSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking));

      // Get recurring bookings that should appear on this date
      const recurringQuery = query(
        this.bookingsCollection,
        where('isRecurring', '==', true)
      );
      const recurringSnapshot = await getDocs(recurringQuery);
      
      const recurringBookings = recurringSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Booking))
        .filter(booking => {
          if (!booking.recurringStartDate) return false;
          
          // Check if the recurring booking should appear on this date
          return (
            isSameDayOfWeek(booking.recurringStartDate, date) &&
            isDateAfterOrEqual(date, booking.recurringStartDate)
          );
        });

      // Combine and sort by time
      const allBookings = [...directBookings, ...recurringBookings];
      return allBookings.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  /**
   * Get all bookings for a client
   */
  async getClientBookings(clientId: string): Promise<Booking[]> {
    const q = query(
      this.bookingsCollection,
      where('clientId', '==', clientId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  }
}

// Export singleton instance
export const bookingService = new BookingService();