import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement>>;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ id, label, children, error }) => {
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-cyan-500';

  // Clone the child element to add standardized props
  const enhancedChild = React.cloneElement(children, {
    id,
    // Combine existing classNames with the standard ones
    className: `w-full bg-gray-700 text-white border rounded-md py-2 px-3 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${errorClasses} ${children.props.className || ''}`,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
  });
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      {enhancedChild}
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};