"use client";
import * as React from 'react';
// Kleine Utility statt externer clsx Abhängigkeit
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean; // ermöglicht Nutzung eines anderen Elements (z.B. Link)
}

const base = 'inline-flex items-center font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed';
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 h-8 gap-1',
  md: 'text-sm px-4 h-10 gap-1.5',
  lg: 'text-base px-5 h-12 gap-2'
};
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
  secondary: 'bg-neutral-800 text-white hover:bg-neutral-900 focus-visible:ring-neutral-600',
  outline: 'border border-neutral-300 text-neutral-800 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-300'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, loading, leftIcon, rightIcon, children, disabled, asChild, ...rest }, ref
) {
  // Wir bauen den inneren Button-Inhalt unabhängig vom Wrapper auf, damit bei asChild
  // kein doppeltes Einfügen (z.B. <a> in <a>) passiert. Statt das originale Kind als Wrapper
  // erneut zu verwenden UND children nochmals als content zu rendern (führt zu verschachtelten Tags),
  // extrahieren wir nur seinen Typ + Props und ersetzen dessen children komplett durch unseren Content.
  const innerContent = (
    <>
      {leftIcon && <span className="shrink-0" aria-hidden>{leftIcon}</span>}
      <span className={cx('inline-flex items-center', loading && 'opacity-0')}>{!asChild ? children : null}</span>
      {rightIcon && <span className="shrink-0" aria-hidden>{rightIcon}</span>}
      {loading && (
        <span className="absolute inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-label="Lädt" />
      )}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    interface GenericElProps { [key: string]: unknown; className?: string; children?: React.ReactNode }
    const element = children as React.ReactElement<GenericElProps>;
    const childProps: GenericElProps = (element.props as GenericElProps) || {};
    const mergedClass = cx(base, sizeStyles[size], variantStyles[variant], childProps.className || '', className || '');
    const slotProps: GenericElProps = { ...childProps, ...rest, className: mergedClass, 'data-button-slot': true };
    if (disabled || loading) slotProps['aria-disabled'] = true;
    // Wir nehmen NICHT element.props.children wieder auf, sondern ersetzen vollständig.
    return React.cloneElement(element, slotProps, (
      <span className="relative inline-flex items-center gap-2">
        {leftIcon && <span className="shrink-0" aria-hidden>{leftIcon}</span>}
  <span className={cx('inline-flex items-center', loading && 'opacity-0')}>{childProps.children}</span>
        {rightIcon && <span className="shrink-0" aria-hidden>{rightIcon}</span>}
        {loading && (
          <span className="absolute inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-label="Lädt" />
        )}
      </span>
    ));
  }

  return (
    <button
      ref={ref}
      className={cx(base, sizeStyles[size], variantStyles[variant], className || '')}
      disabled={disabled || loading}
      {...rest}
    >
      {innerContent}
    </button>
  );
});

export default Button;
