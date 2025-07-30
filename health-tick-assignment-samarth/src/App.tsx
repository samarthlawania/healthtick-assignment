// src/App.tsx
import { Calendar } from './components/calendar/Calendar';
import Header from './components/layout/Header';
import { BookingModal } from './components/calendar/BookingModal';
import { useState, useEffect } from 'react';
import type { Booking } from './types';
import { useBookings } from './hooks/useBooking';
import { useClients } from './hooks/useClients';
import { initializeAuth, auth } from './services/firebase'; // Import auth and initializeAuth
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { LoadingSpinner } from './components/ui/LoadingSpinner'; // Import LoadingSpinner component

function App() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // State to store the authenticated user's ID
  const [isAuthReady, setIsAuthReady] = useState(false); // State to track auth readiness

  // Derive currentDate string in YYYY-MM-DD format for the useBookings hook
  const currentDate = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
  const initAuth = async () => {
    await initializeAuth();
    console.log("auth.currentUser", auth.currentUser);


    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(crypto.randomUUID());
      }
      setIsAuthReady(true);
    });

    // Store unsubscribe to call on unmount
    return unsubscribe;
  };

  let unsubscribe: () => void;

  initAuth().then((unsub) => {
    unsubscribe = unsub;
  });

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, []);

  const {
    bookings,
    loading, // Loading state for bookings
    error,   // Error state for bookings
    addBooking, // Function to add a new booking
    deleteBooking, // Function to delete an existing booking
    refreshBookings // Function to manually refresh booking data
  } = useBookings(currentDate, userId, isAuthReady);

  // Use the useClients hook to fetch client data
  const {
    clients,
    loading: clientsLoading, // Loading state for clients
    error: clientsError // Error state for clients
  } = useClients();

  // Handler for when an empty time slot is clicked
  const handleSlotClick = (slotTime: string) => {
    setSelectedSlot(slotTime); // Set the selected time slot
    setEditingBooking(null);   // Clear any existing booking being edited
    setModalOpen(true);        // Open the booking modal
  };

  // Handler for when an existing booking is clicked (e.g., to edit or delete)
  const handleEditBooking = (booking: Booking) => {
    setSelectedSlot(booking.time); // Set the time of the booking being edited
    setEditingBooking(booking);    // Set the booking object for editing
    setModalOpen(true);            // Open the booking modal
  };

  // Handler to close the booking modal and reset related states
  const closeModal = () => {
    setModalOpen(false);       // Close the modal
    setSelectedSlot(null);     // Clear selected slot
    setEditingBooking(null);   // Clear editing booking
  };

  if (!isAuthReady || loading || clientsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Display an error message if there's an issue with fetching bookings or clients
  if (error || clientsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 p-4">
        <p className="text-lg font-medium">
          Error: {
            (typeof error === 'string' && error) ||
            (typeof error === 'object' && error && 'message' in error && (error as any).message) ||
            (typeof clientsError === 'string' && clientsError) ||
            (typeof clientsError === 'object' && clientsError && 'message' in clientsError && (clientsError as any).message) ||
            'An unknown error occurred.'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-inter">
        <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <main className="max-w-4xl mx-auto px-4 py-6">
          {userId && ( // Display the current user ID for identification and debugging
            <div className="text-center text-sm text-gray-600 mb-4 p-2 bg-white rounded-lg shadow-sm">
              Your User ID: <span className="font-semibold break-all text-blue-700">{userId}</span>
            </div>
          )}
          <Calendar
            selectedDate={selectedDate}
            date={currentDate}
            bookings={bookings}
            onSlotClick={handleSlotClick}
            onEditBooking={handleEditBooking}
          />
        </main>

        {}
        {isModalOpen && selectedSlot && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onBook={addBooking} 
            selectedTime={selectedSlot}
            selectedDate={currentDate}
            clients={clients}
            existingBookings={bookings}
            userId={userId} 
          />
        )}
      </div>
    </>
  );
}

export default App;
