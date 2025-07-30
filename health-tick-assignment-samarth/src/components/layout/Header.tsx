import React from 'react';

interface HeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedDate, setSelectedDate }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
      <div className="text-xl font-bold">📅 My Calendar</div>
      <div className="flex items-center gap-3">
        <button
          onClick={goToPreviousDay}
          className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
        <button
          onClick={goToNextDay}
          className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
        >
          →
        </button>
      </div>
    </header>
  );
};

export default Header;
