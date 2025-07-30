import React from 'react';
import type{ Booking } from '../../types';

interface TimeSlotProps {
  time: string;
  booking?: Booking;
  onClick?: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, booking, onClick }) => {
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
          <div className="text-sm">
            <div>{booking.clientName}</div>
            <div className="text-xs text-gray-600">{booking.callType}</div>
          </div>
        )}
      </div>
    </div>
  );
};
