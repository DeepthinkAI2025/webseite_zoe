import React from 'react';

// Vereinheitlichte Button-Komponente.
// Ziel: Alle interaktiven Call-to-Actions laufen über diese Schnittstelle.
// Varianten decken klassische CTA Styles + technische/ikonische Buttons (fab, plain/unstyled) ab.
// Props:
//  - variant: primary | outline | secondary | ghost | destructive | fab | plain
//  - size: sm | md | lg | xl
//  - loading: Spinner Overlay
//  - iconStart / iconEnd: ReactNode
//  - as: Elementtyp (button | a | Link etc.)
//  - type: falls Button (default 'button')

const VARIANT_CLASS = {
  primary: 'btn-primary',
  outline: 'btn-outline-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  destructive: 'btn-destructive',
  fab: 'fab-btn', // kreisrunde Floating Action Buttons
  plain: '' // ungestylte Variante (bewusst minimal) – nutzt nur übergebene className Utilities
};

const SIZE_CLASS = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'btn-lg px-8 py-4 text-base' // xl nutzt lg Basis + größere Padding-Erweiterung
};

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type,
  iconStart,
  iconEnd,
  as: Component = 'button',
  children,
  ...rest
}) {
  const variantCls = VARIANT_CLASS[variant] !== undefined ? VARIANT_CLASS[variant] : VARIANT_CLASS.primary;
  const sizeCls = SIZE_CLASS[size] || '';
  const loadingCls = loading ? 'btn-loading' : '';
  const isDisabled = disabled || loading;
  const btnType = Component === 'button' ? (type || 'button') : undefined;
  return (
    <Component
      className={`${variantCls} ${sizeCls} ${loadingCls} ${className}`.trim()}
      disabled={isDisabled}
      type={btnType}
      aria-busy={loading || undefined}
      {...rest}
    >
      {iconStart && <span className="btn-icon-start flex items-center" aria-hidden="true">{iconStart}</span>}
      <span className="inline-flex items-center gap-2">{children}</span>
      {iconEnd && <span className="btn-icon-end flex items-center" aria-hidden="true">{iconEnd}</span>}
    </Component>
  );
}

export default Button;
