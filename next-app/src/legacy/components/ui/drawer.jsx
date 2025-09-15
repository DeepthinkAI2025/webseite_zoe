import React, { useEffect, useRef } from 'react';

/**
 * Accessible Drawer (Seiten-Paneel) mit Fokus-Trap & ESC Close.
 * Props: open, onClose, title, children, ariaDescription
 */
export function Drawer({ open, onClose, title, ariaDescription, children }) {
	const ref = useRef(null);
	// Fokusfalle + ESC
	useEffect(() => {
		if (!open) return;
		const drawer = ref.current;
		const focusable = drawer?.querySelectorAll(
			'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
		);
		const first = focusable?.[0];
		const last = focusable?.[focusable.length - 1];
		first && first.focus();
		function handleKey(e){
			if(e.key === 'Escape') { onClose?.(); }
			if(e.key === 'Tab' && focusable.length){
				if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
				else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
			}
		}
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [open, onClose]);

	if(!open) return null;
	const titleId = title ? 'drawer-title' : undefined;
	const descId = ariaDescription ? 'drawer-desc' : undefined;
	return (
		<div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId}>
			<div className="fixed inset-0 bg-black/40" onClick={() => onClose?.()} aria-hidden="true" />
			<div ref={ref} className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto focus-visible:focus-ring" tabIndex={-1}>
				<div className="flex items-start justify-between mb-4">
					{title && <h2 id={titleId} className="text-lg font-semibold text-neutral-900">{title}</h2>}
					<button onClick={() => onClose?.()} className="p-2 rounded hover:bg-neutral-100 focus-visible:focus-ring" aria-label="Schließen">
						✕
					</button>
				</div>
				{ariaDescription && <p id={descId} className="sr-only">{ariaDescription}</p>}
				<div className="space-y-4">
					{children}
				</div>
			</div>
		</div>
	);
}

export default Drawer;
