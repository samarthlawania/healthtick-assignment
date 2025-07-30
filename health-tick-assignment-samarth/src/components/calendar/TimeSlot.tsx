import React from 'react';
import type{ Booking } from '../../types';
import { Trash2 } from 'lucide-react';

interface TimeSlotProps {
  time: string;
  booking?: Booking;
  onClick?: () => void;
  onDeleteBooking: (bookingId: string) => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, booking, onClick, onDeleteBooking }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the booking modal when clicking delete
    if (booking) {
      onDeleteBooking(booking.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-2 border rounded cursor-pointer ${
        booking ? 'bg-gray-200' : 'hover:bg-blue-100'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-mono">{time}</span>
        {booking && (
          <div className="text-sm flex items-center gap-2">
            <div>
              <div>{booking.clientName}</div>
              <div className="text-xs text-gray-600">{booking.callType}</div>
            </div>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={handleDeleteClick}
              aria-label="Delete booking"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
