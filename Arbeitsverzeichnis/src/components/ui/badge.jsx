import React from 'react';

/*
  Harmonisierte Badge Komponente
  ---------------------------------
  Ziel: Nur noch drei visuelle Varianten (soft | outline | invert).
  Farbe wird über einen separaten "color" Prop gesteuert (neutral | amber | emerald | ambient).
  Frühere Ad-hoc Varianten (amber, emerald, ambient, secondary) werden hier gemappt, damit bestehende
  Aufrufe nicht sofort brechen. Bitte sukzessive refactoren auf das neue API:

    <Badge variant="soft" color="amber">...</Badge>
    <Badge variant="outline" color="ambient">...</Badge>

  Mapping (intern -> bestehende CSS Klassen):
    soft + neutral  -> .badge .badge-soft
    soft + amber    -> .badge .badge-amber
    soft + emerald  -> .badge .badge-emerald
    outline + neutral -> .badge .badge-outline
    outline + ambient -> .badge .badge-outline .badge-outline-ambient
    invert + * -> .badge .badge-invert (Farbe derzeit nicht variiert)
*/

const SIZE_CLASS = { md: '', xs: 'badge-xs' };

function resolveClasses(variant, color) {
  if (variant === 'invert') return 'badge badge-invert';
  if (variant === 'outline') {
    if (color === 'ambient') return 'badge badge-outline badge-outline-ambient';
    return 'badge badge-outline';
  }
  // soft
  switch (color) {
    case 'amber': return 'badge badge-amber';
    case 'emerald': return 'badge badge-emerald';
    default: return 'badge badge-soft';
  }
}

export function Badge({
  variant = 'soft',
  color = 'neutral',
  size = 'md',
  className = '',
  children,
  as: Component = 'span',
  ...rest
}) {
  // BACKWARD-MAPPING (TEMPORÄR) -- Removal Ziel: Release v3.4
  // --------------------------------------------------------
  // Zweck: Alte Aufrufe (<Badge variant="amber"/>) nicht brechen lassen.
  // Nach vollständiger Migration & erfolgreichem Durchlauf des Scripts
  // `npm run check:ui-variants` (0 Treffer) in zwei aufeinanderfolgenden Releases entfernen.
  // TODO[v3.4]: Diesen Block + zugehörige Mapping-Tests löschen.
  let _variant = variant;
  let _color = color;
  if (['amber', 'emerald'].includes(variant)) {
    _variant = 'soft';
    _color = variant; // Farbe übernehmen
  } else if (variant === 'ambient') {
    _variant = 'outline';
    _color = 'ambient';
  } else if (variant === 'secondary') { // vereinzelt genutzt -> neutrales soft
    _variant = 'soft';
  }

  const variantCls = resolveClasses(_variant, _color);
  const sizeCls = SIZE_CLASS[size] || '';

  return (
    <Component className={[variantCls, sizeCls, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Component>
  );
}

export default Badge;
