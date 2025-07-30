import React from 'react';
import { Button } from '../ui/Button';

interface Props {
  currentDate: Date;
  onChange: (date: Date) => void;
}

export const DateNavigation: React.FC<Props> = ({ currentDate, onChange }) => {
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

  const addDays = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    onChange(newDate);
  };

  return (
    <div className="flex justify-between items-center py-4">
      <Button onClick={() => addDays(-1)}>Previous</Button>
      <h2 className="text-xl font-bold">{formatDate(currentDate)}</h2>
      <Button onClick={() => addDays(1)}>Next</Button>
    </div>
  );
};
