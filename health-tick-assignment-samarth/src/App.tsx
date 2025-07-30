// src/App.tsx
import { Calendar } from './components/calendar/Calendar';
import Header from './components/layout/Header';
import { BookingModal } from './components/calendar/BookingModal';
import { useState, useEffect } from 'react';
import type { Booking } from './types';
import { useBookings } from './hooks/useBooking';
import { useClients } from './hooks/useClients';
import { initializeAuth, auth } from './services/firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { LoadingSpinner } from './components/ui/LoadingSpinner'; 
import DatePicker from './components/ui/DatePicker';
import { format } from 'date-fns';


function App() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); 
  const [isAuthReady, setIsAuthReady] = useState(false); 
  const [showDatePicker, setShowDatePicker] = useState(false);

const currentDate = format(selectedDate, 'yyyy-MM-dd');
  console.log("selectedDate", selectedDate);
  console.log("currentDate", currentDate);

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
    loading, 
    error,   
    addBooking, 
    deleteBooking, 
  } = useBookings(currentDate);

  const {
    clients,
    loading: clientsLoading, 
    error: clientsError 
  } = useClients();

  const handleSlotClick = (slotTime: string) => {
    setSelectedSlot(slotTime); 
    setEditingBooking(null);   
    setModalOpen(true);        
  };

  const handleSelectDateFromPicker = (date: Date) => {
    setSelectedDate(date) 
    setShowDatePicker(false); 
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedSlot(booking.time); 
    setEditingBooking(booking);   
    setModalOpen(true);            
  };
  const handleOpenDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeModal = () => {
    setModalOpen(false);       
    setSelectedSlot(null);   
    setEditingBooking(null);   
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
        <Header
          selectedDate={selectedDate}
          onPrevDay={() => setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 1);
            return newDate;
          })}
          onNextDay={() => setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 1);
            return newDate;
          })}
          onToday={() => setSelectedDate(new Date())}
          onOpenDatePicker={handleOpenDatePicker}
        />
        <DatePicker
          isOpen={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelectDate={handleSelectDateFromPicker}
          initialDate={selectedDate}
        />
        <main className="max-w-4xl mx-auto px-4 py-6">
          {userId && ( 
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
            onDeleteBooking={deleteBooking}
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
