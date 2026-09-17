import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'border border-[var(--cv-border)] hover:border-[var(--cv-primary)] text-[var(--cv-text-main)] hover:text-[var(--cv-primary)] bg-transparent',
    ghost: 'hover:bg-[var(--cv-bg-warm)] text-[var(--cv-text-main)] bg-transparent',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex mr-1.5">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
