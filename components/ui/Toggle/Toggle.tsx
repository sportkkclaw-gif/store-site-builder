'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const toggleId = id || props.name;

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2" />
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 peer-checked:translate-x-5" />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label htmlFor={toggleId} className="text-sm font-medium text-gray-700 cursor-pointer">
                {label}
              </label>
            )}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
