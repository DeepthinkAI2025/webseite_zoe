import React from "react";

// Reusable Pill/Chip component for consistent styling across the site
// Props:
// - icon: optional React component (e.g., lucide icon)
// - variant: 'light' | 'dark' | 'custom'
// - className: extra classes (esp. for custom variant)
// - size: 'xs' | 'sm' | 'md' (default 'sm')
export function Pill({ children, icon: Icon, variant = 'light', className = '', size = 'sm', ...rest }) {
  const sizeCls = size==='xs'
    ? 'px-2.5 py-0.5 text-[12px]'
    : size==='sm'
      ? 'px-3.5 py-1.5 text-sm'
      : 'px-4 py-1.5 text-base';
  const iconSize = size==='md' ? 'w-5 h-5' : 'w-4 h-4';
  const base = `inline-flex items-center gap-2 rounded-full ${sizeCls} border`;
  const preset = variant === 'dark'
    ? 'bg-white/10 text-white border-white/20 backdrop-blur'
    : variant === 'light'
      ? 'bg-white text-gray-800 border-gray-200'
      : 'border-gray-200'; // custom: rely on className for bg/text/border
  return (
    <span className={[base, preset, className].filter(Boolean).join(' ')} {...rest}>
      {Icon ? <Icon className={`${iconSize} ${variant==='dark' ? 'text-emerald-300' : 'text-emerald-600'}`} /> : null}
      {children}
    </span>
  );
}

export default Pill;
