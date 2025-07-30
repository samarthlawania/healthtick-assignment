import React, { useState, useEffect} from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  initialDate: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ isOpen, onClose, onSelectDate, initialDate }) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  useEffect(() => {
    if (isOpen) {
      setCurrentMonth(initialDate);
    }
  }, [initialDate, isOpen]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day: Date) => {
    onSelectDate(day);
    console.log("Selected date:", format(day, 'yyyy-MM-dd'));
    onClose();
  };

  const firstDayOfMonth = startOfMonth(currentMonth).getDay(); // 0 = Sunday, 1 = Monday

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Date">
      <div className="p-4 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next Month"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-medium text-gray-500">
              {day}
            </div>
          ))}
          {/* Empty cells for days before the 1st of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}
          {daysInMonth.map(day => (
            <button
              key={format(day, 'yyyy-MM-dd')}
              onClick={() => handleDayClick(day)}
              className={`
                w-full h-8 flex items-center justify-center rounded-full
                ${isSameMonth(day, currentMonth) ? 'text-gray-900' : 'text-gray-400'}
                ${isSameDay(day, initialDate) ? 'bg-blue-500 text-white font-bold' : 'hover:bg-blue-100'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DatePicker;
