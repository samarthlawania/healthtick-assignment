import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {Button} from '../ui/Button'; 

interface HeaderProps {
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onOpenDatePicker: () => void; 
}

const Header: React.FC<HeaderProps> = ({ selectedDate, onPrevDay, onNextDay, onToday, onOpenDatePicker }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center rounded-b-lg">
      <div className="flex items-center mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-gray-900 mr-4">HealthTick Calendar</h1>
        <Button onClick={onToday} variant="secondary" className="mr-2">Today</Button>
        <button
          onClick={onOpenDatePicker} 
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open Calendar"
        >
          <CalendarIcon size={20} className="text-gray-600" />
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevDay}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous Day"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <span className="text-xl font-semibold text-gray-800 w-40 text-center">
          {format(selectedDate, 'MMM dd, yyyy')}
        </span>
        <button
          onClick={onNextDay}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next Day"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
