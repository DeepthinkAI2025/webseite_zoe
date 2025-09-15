import * as React from 'react';
import { ElementType } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8'
};

export function Card({ as: Tag = 'div', padding = 'md', border = true, hover = true, className = '', children, ...rest }: CardProps) {
  const Component: ElementType = Tag || 'div';
  return React.createElement(
    Component,
    {
      className: [
        'relative rounded bg-white/60 backdrop-blur shadow-sm',
        border && 'border border-neutral-200',
        hover && 'transition hover:shadow',
        paddingMap[padding],
        className
      ].filter(Boolean).join(' '),
      ...rest
    },
    children
  );
}

export function CardHeader({ className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={['mb-3', className].filter(Boolean).join(' ')} {...rest} />;
}
export function CardTitle({ className = '', ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={['font-semibold text-lg leading-snug', className].filter(Boolean).join(' ')} {...rest} />;
}
export function CardContent({ className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={['text-sm leading-relaxed text-neutral-700', className].filter(Boolean).join(' ')} {...rest} />;
}

export default Card;
