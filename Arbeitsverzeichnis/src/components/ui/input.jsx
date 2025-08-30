import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
  className={`w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
      {...props}
    />
  );
}
