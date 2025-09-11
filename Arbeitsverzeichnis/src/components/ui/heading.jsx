import React from 'react';

const sizeMap = {
	'2xl': 'text-3xl md:text-4xl',
	'3xl': 'text-4xl md:text-5xl',
	'4xl': 'text-5xl md:text-6xl'
};

export function Heading({ as:Comp='h2', size='3xl', className='', children }){
	const cls = [
		'font-bold tracking-tight',
		sizeMap[size] || sizeMap['3xl'],
		className
	].filter(Boolean).join(' ');
	return <Comp className={cls}>{children}</Comp>;
}

export default Heading;
