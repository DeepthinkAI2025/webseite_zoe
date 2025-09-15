import React from 'react';

export function Label({ className = '', children, ...props }) {
  return (
    <label className={`block text-sm font-medium text-neutral-700 ${className}`} {...props}>
      {children}
    </label>
  );
}
