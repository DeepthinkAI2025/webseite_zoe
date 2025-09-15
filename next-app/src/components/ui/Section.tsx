import * as React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  width?: 'narrow' | 'default' | 'wide';
  bleed?: boolean; // falls true: kein zentrierter Container wrapper
  as?: keyof HTMLElementTagNameMap;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  noPaddingX?: boolean; // deaktiviert horizontale Innenabstände
}

const widthMap = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl'
};

// Neue vertikale Rhythmus Skala (≈4rem Schritte auf größeren Screens)
const spacingMap: Record<NonNullable<SectionProps['spacing']>, string> = {
  none: 'py-0',
  xs: 'py-4 md:py-6',
  sm: 'py-8 md:py-10',
  md: 'py-12 md:py-14',
  lg: 'py-16 md:py-20',
  xl: 'py-20 md:py-28'
};

export function Section({
  width = 'default',
  as: Tag = 'section',
  bleed = false,
  spacing = 'lg',
  noPaddingX = false,
  className = '',
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag
      className={[
        bleed ? '' : 'mx-auto',
        bleed ? '' : widthMap[width],
        noPaddingX ? '' : 'px-6 md:px-8',
        spacingMap[spacing],
        className
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Section;
