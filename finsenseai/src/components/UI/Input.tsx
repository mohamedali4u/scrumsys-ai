import React from 'react';

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  disabled = false,
  autoFocus = false,
  className = '',
  maxLength
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      autoFocus={autoFocus}
      maxLength={maxLength}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    />
  );
};