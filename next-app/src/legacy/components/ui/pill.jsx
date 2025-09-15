import React from "react";

/*
  Harmonisiertes Pill (Chip) API analog zu <Badge>:
  ------------------------------------------------
  Props:
    variant: visual treatment (soft | outline | invert)
    color:   semantic color (neutral | amber | emerald | info | warning | custom)   (custom -> rely on className)
    size:    xs | sm | md
    icon:    optional leading Icon component

  Backwards Kompatibilität:
    alt Varianten 'light' -> soft neutral
    'dark' -> invert neutral
    'custom' -> outline custom (keine vordefinierte Farbe)

  Ziel: vereinfachte Farbsemantik & konsistente Token Nutzung.
*/

const SIZE_CLS = {
  xs: 'px-2.5 py-0.5 text-[11px] font-medium',
  sm: 'px-3 py-1 text-xs font-medium',
  md: 'px-4 py-1.5 text-sm font-medium'
};

function resolvePillClasses(variant, color) {
  // Baseline style
  const base = 'inline-flex items-center gap-2 rounded-full border transition-colors';
  if (color === 'custom') {
    // Allow external classes to define final look
    return base + ' border-neutral-200';
  }
  // Color palette mapping
  const palette = {
    neutral: {
      soft: 'bg-white text-neutral-800 border-neutral-200',
      outline: 'bg-transparent text-neutral-700 border-neutral-300',
      invert: 'bg-neutral-900 text-white border-neutral-900'
    },
    amber: {
      soft: 'bg-amber-50 text-amber-800 border-amber-200',
      outline: 'bg-transparent text-amber-800 border-amber-300',
      invert: 'bg-amber-600 text-white border-amber-600'
    },
    emerald: {
      soft: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      outline: 'bg-transparent text-emerald-700 border-emerald-300',
      invert: 'bg-emerald-600 text-white border-emerald-600'
    },
    success: { // alias -> emerald
      soft: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      outline: 'bg-transparent text-emerald-700 border-emerald-300',
      invert: 'bg-emerald-600 text-white border-emerald-600'
    },
    info: {
      soft: 'bg-blue-50 text-blue-700 border-blue-200',
      outline: 'bg-transparent text-blue-700 border-blue-300',
      invert: 'bg-blue-600 text-white border-blue-600'
    },
    warning: {
      soft: 'bg-orange-50 text-orange-700 border-orange-200',
      outline: 'bg-transparent text-orange-700 border-orange-300',
      invert: 'bg-orange-600 text-white border-orange-600'
    },
    danger: {
      soft: 'bg-red-50 text-red-700 border-red-200',
      outline: 'bg-transparent text-red-700 border-red-300',
      invert: 'bg-red-600 text-white border-red-600'
    },
    purple: {
      soft: 'bg-purple-50 text-purple-700 border-purple-200',
      outline: 'bg-transparent text-purple-700 border-purple-300',
      invert: 'bg-purple-600 text-white border-purple-600'
    }
  };
  const colors = palette[color] || palette.neutral;
  let v = variant;
  if (!['soft','outline','invert'].includes(v)) v = 'soft';
  return base + ' ' + colors[v];
}

export function Pill({
  children,
  icon: Icon,
  variant = 'soft',
  color = 'neutral',
  className = '',
  size = 'sm',
  ...rest
}) {
  // BACKWARD-MAPPING (TEMPORÄR) -- Removal Ziel: Release v3.4
  // --------------------------------------------------------
  // Variante 'light'|'dark'|'custom' stammen aus v3.2.
  // Nach vollständiger Migration & stable Release (2 Deploys ohne Treffer)
  // mittels `npm run check:ui-variants` entfernen.
  // TODO[v3.4]: Block löschen + vereinfachten Codepfad belassen.
  if (['light','dark','custom'].includes(variant)) {
    if (variant === 'light') variant = 'soft';
    else if (variant === 'dark') variant = 'invert';
    else if (variant === 'custom') { variant = 'outline'; color = 'custom'; }
  }
  const sizeCls = SIZE_CLS[size] || SIZE_CLS.sm;
  const pillCls = resolvePillClasses(variant, color);
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <span className={[pillCls, sizeCls, className].filter(Boolean).join(' ')} {...rest}>
      {Icon ? <Icon className={iconSize} /> : null}
      {children}
    </span>
  );
}

export default Pill;
