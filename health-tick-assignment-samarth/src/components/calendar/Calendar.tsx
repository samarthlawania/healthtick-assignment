// src/components/calendar/Calendar.tsx
import React from 'react';
import { TimeSlot } from './TimeSlot';
import type{ Booking } from '../../types';

interface CalendarProps {
  bookings: Booking[];
  onSlotClick: (time: string) => void;
  onEditBooking: (booking: Booking) => void;
  selectedDate: Date;
  date: string;
}

export const Calendar: React.FC<CalendarProps> = ({ bookings, onSlotClick, date, onEditBooking }) => {
  const timeSlots = Array.from({ length: 27 }, (_, i) => {
    const hour = 10 + Math.floor((i * 20 + 30) / 60);
    const minute = (i * 20 + 30) % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <div className="grid gap-2">
      {timeSlots.map((time) => {
        const existing = bookings.find((b) => b.time === time);
        return (
          <TimeSlot
            key={time}
            time={time}
            booking={existing}
            onClick={() => existing ? onEditBooking(existing) : onSlotClick(time)}
          />
        );
      })}
    </div>
  );
};