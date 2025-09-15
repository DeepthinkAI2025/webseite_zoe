"use client";
import React from 'react';
import { useReveal } from '@/hooks/useReveal';

type AnyElement = keyof React.JSX.IntrinsicElements;
interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: AnyElement;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function Reveal({ as = 'div', once, threshold, rootMargin, children, ...rest }: RevealProps){
  const Comp: any = as;
  const ref = useReveal<HTMLElement>({ once, threshold, rootMargin });
  return <Comp ref={ref} {...rest}>{children}</Comp>;
}
