import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const base = 'px-4 py-2 rounded text-white font-medium';
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-gray-500 hover:bg-gray-600';

  return (
    <button {...props} className={`${base} ${styles} ${props.className || ''}`}>
      {children}
    </button>
  );
};
