import * as React from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'outline' | 'inverted' | 'success' | 'danger';
export type BadgeSize = 'xs' | 'sm';

function cx(...cls: Array<string | false | null | undefined>) {return cls.filter(Boolean).join(' ');} 

const base = 'inline-flex items-center font-medium rounded-full border text-[10px] tracking-wide uppercase select-none';
const sizeStyles: Record<BadgeSize,string> = { xs: 'px-2 py-0.5 gap-1', sm: 'px-3 py-1 text-[11px] gap-1.5' };
const variantStyles: Record<BadgeVariant,string> = {
  neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
  accent: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-700/40',
  outline: 'bg-white/5 dark:bg-neutral-900/30 text-neutral-500 dark:text-neutral-300 border-neutral-300/60 dark:border-neutral-600/60',
  inverted: 'bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100',
  success: 'bg-emerald-500 text-white border-emerald-600',
  danger: 'bg-red-500 text-white border-red-600'
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({variant='neutral', size='xs', className, leftIcon, rightIcon, children, ...rest}) => (
  <span className={cx(base, sizeStyles[size], variantStyles[variant], className)} {...rest}>
    {leftIcon && <span aria-hidden className="inline-flex items-center">{leftIcon}</span>}
    <span>{children}</span>
    {rightIcon && <span aria-hidden className="inline-flex items-center">{rightIcon}</span>}
  </span>
);

export default Badge;
