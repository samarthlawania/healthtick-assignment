// src/components/calendar/BookingModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Client, CallType, BookingModalProps} from '../../types';
import { getCallDuration, checkTimeSlotConflict } from '../../utils/timeUtils'; // Import getCallDuration and checkTimeSlotConflict

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onBook,
  selectedTime,
  selectedDate,
  clients,
  existingBookings,
  userId,
  editingBooking
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [callType, setCallType] = useState<CallType>('onboarding');
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false); 

  useEffect(() => {
    if (editingBooking) {
      // If editing, pre-fill client, call type, and search term
      const clientToEdit = clients.find(c => c.id === editingBooking.clientId);
      setSelectedClient(clientToEdit || null);
      setCallType(editingBooking.callType);
    } else {
      setSelectedClient(null);
      setCallType('onboarding');
    }
    setError(null);
    setIsBooking(false); 
  }, [editingBooking, isOpen, clients]);


  const handleBookNow = async () => { 
    if (!userId) {
      setError('Authentication error: User ID not available. Please refresh.');
      return;
    }
    if (!selectedClient) {
      setError('Please select a client.');
      return;
    }

    const duration = getCallDuration(callType);
     const bookingsToCheckForConflict = editingBooking ? existingBookings.filter(b => b.id !== editingBooking.id): existingBookings;
    if (checkTimeSlotConflict(selectedTime, callType, bookingsToCheckForConflict)) {
      setError('This time slot conflicts with an existing booking. Please choose another time.');
      return;
    }

    setIsBooking(true); 
    setError(null); 

    try {
     
      const bookingPayload: any = {
        date: selectedDate,
        time: selectedTime,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        callType,
        isRecurring: callType === 'follow-up',
        duration,
        status: 'scheduled',
      };
      if (editingBooking) {
        bookingPayload.id = editingBooking.id;
      }

      if (callType === 'follow-up') {
        bookingPayload.recurringStartDate = selectedDate;
      }

      await onBook(bookingPayload);
      onClose(); 
    } catch (err: any) {
      setError(err.message || 'Failed to book slot. Please try again.');
      console.error("BookingModal: Booking failed:", err);
    } finally {
      setIsBooking(false); 
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book Slot at ${selectedTime}`}>
      <div className="space-y-4 p-4">

        {/* Client Selection Dropdown */}
        <select
          className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out bg-white"
          onChange={(e) =>
            setSelectedClient(clients.find((c) => c.id === e.target.value) || null)
          }

          value={selectedClient?.id || ''}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.phone}
            </option>
          ))}
        </select>

        {/* Call Type Selection */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              checked={callType === 'onboarding'}
              onChange={() => setCallType('onboarding')}
            />
            <span className="ml-2 text-gray-700">Onboarding (40 min)</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              checked={callType === 'follow-up'}
              onChange={() => setCallType('follow-up')}
            />
            <span className="ml-2 text-gray-700">Follow-up (20 min, weekly)</span>
          </label>
        </div>

        {/* Error Message Display */}
        {error && <p className="text-red-600 text-sm mt-2 p-2 bg-red-100 border border-red-300 rounded-md">{error}</p>}

        {/* Book Now Button */}
        <Button
          disabled={!selectedClient || isBooking} // Disable if no client selected or if booking is in progress
          onClick={handleBookNow}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          {isBooking ? 'Booking...' : 'Book Now'}
        </Button>
      </div>
    </Modal>
  );
};
