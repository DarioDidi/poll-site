// src/components/common/Button.tsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      isLoading = false,
      disabled = false,
      className = '',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${fullWidth ? 'w-full' : ''
      }`;

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm hover:from-blue-600 hover:to-purple-700 hover:shadow-md focus:ring-blue-500',
      secondary:
        'bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-blue-500',
      danger:
        'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md focus:ring-red-500',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${(disabled || isLoading) ? disabledClasses : ''
          } ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
