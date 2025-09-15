// The file `/workspaces/webseite_zoe/Arbeitsverzeichnis/src/components/ui/field.jsx` is being populated with the Field component.
import React from 'react';

/**
 * Field Wrapper: Stellt Label, Hint, Error & ARIA-Verknüpfung bereit.
 * Usage:
 * <Field id="email" label="E-Mail" required error={errors.email} hint="Wir teilen nichts." >
 *    <Input />
 * </Field>
 */
export function Field({ id, label, required, hint, error, children, className = '' }) {
	const hintId = hint ? `${id}-hint` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

	// Child (Input/Select/Textarea) klonen und ARIA Props injizieren falls möglich
	const control = React.isValidElement(children)
		? React.cloneElement(children, {
				id,
				invalid: !!error,
				'aria-required': required || undefined,
				'aria-invalid': error ? 'true' : undefined,
				'aria-describedby': describedBy,
			})
		: children;

	return (
		<div className={`field flex flex-col ${className}`}>
			{label && (
				<label htmlFor={id} className="block text-sm font-medium text-neutral-700">
					<span>{label}{required && <span className="text-red-600" aria-hidden="true">*</span>}</span>
				</label>
			)}
			{control}
			{hint && !error && (
				<p id={hintId} className="mt-1 text-xs text-neutral-600">{hint}</p>
			)}
			{error && (
				<p id={errorId} className="mt-1 text-xs text-red-600" role="alert">{error}</p>
			)}
		</div>
	);
}

export default Field;
