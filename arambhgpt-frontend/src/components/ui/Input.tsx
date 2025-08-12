'use client';

import React from 'react';
import { InputProps } from '@/types';

export function Input({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
  disabled = false,
  error,
  label,
  required = false,
  autoFocus = false,
  className = '',
  min,
  max,
  step,
  minLength,
  maxLength,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm
    bg-white text-gray-900 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-teal-500'
    }
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        min={min}
        max={max}
        step={step}
        minLength={minLength}
        maxLength={maxLength}
        className={inputClasses}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}