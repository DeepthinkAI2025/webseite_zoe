import React from 'react';

export function Badge({ className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 ${className}`}>
      {children}
    </span>
  );
}
