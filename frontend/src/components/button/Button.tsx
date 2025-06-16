import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from './types';

const baseStyles =
  'cursor-pointer px-8 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantStyles = {
  primary:
    'bg-red-400 text-rose-950 hover:bg-red-700 hover:text-red-200 focus:outline-none',
  secondary:
    'bg-gray-300 text-gray-800 hover:bg-gray-400 hover:text-gray-200 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
} as const;

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        baseStyles,
        variantStyles[variant],
        { 'opacity-50 cursor-not-allowed': disabled },
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
