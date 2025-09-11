import React from 'react';

export function Checkbox({ id, checked, onCheckedChange }) {
  return (
    <input
      id={id}
      type="checkbox"
      className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
      checked={!!checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
    />
  );
}
