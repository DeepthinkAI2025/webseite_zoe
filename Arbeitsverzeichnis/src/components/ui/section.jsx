import React from 'react';

const paddingMap = {
	none: 'py-0',
	tight: 'py-8 sm:py-10',
	normal: 'py-14 sm:py-16',
	relaxed: 'py-20 sm:py-24'
};

const sizeMap = {
	narrow: 'max-w-3xl',
	normal: 'max-w-5xl',
	wide: 'max-w-7xl'
};

export function Section({
	as: Comp = 'section',
	padding = 'normal',
	size = 'normal',
	variant = 'plain',
	contain = true,
	className='',
	children
}){
	const pad = paddingMap[padding] || paddingMap.normal;
	const sizeCls = sizeMap[size] || sizeMap.normal;
	const variantCls = variant === 'gradient' ? 'bg-gradient-to-br from-neutral-50 to-neutral-100' : variant === 'neutral' ? 'bg-neutral-50' : '';
		const outer = [variantCls, className].filter(Boolean).join(' ');
		const inner = [contain && 'pro-container', pad, sizeCls].filter(Boolean).join(' ');
		return <Comp className={outer}><div className={inner}>{children}</div></Comp>;
}

export default Section;
