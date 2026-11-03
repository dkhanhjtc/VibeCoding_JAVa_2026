import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Button Primitive with consistent states and micro-interactions
 */
export const Button = ({
  children,
  variant = 'navy',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 ease-out select-none active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    navy: 'bg-[#00203d] hover:bg-[#2e5e73] text-white shadow-subtle hover:shadow-card focus-visible:ring-[#00203d]',
    primary: 'bg-[#3b7a8c] hover:bg-[#2e5e73] text-white shadow-subtle hover:shadow-card focus-visible:ring-[#3b7a8c]',
    white: 'bg-white hover:bg-[#f0f4f8] text-[#00203d] shadow-subtle hover:shadow-card focus-visible:ring-white',
    outline: 'border border-[#a1c0d1] hover:border-[#00203d] bg-white hover:bg-[#f0f4f8] text-[#00203d] focus-visible:ring-[#3b7a8c]',
    ghost: 'text-[#1f4f5a] hover:text-[#00203d] hover:bg-[#f0f4f8] focus-visible:ring-[#3b7a8c]'
  };

  const sizes = {
    sm: 'text-xs py-1.5 px-3 rounded-lg gap-1.5',
    md: 'text-xs sm:text-sm py-2.5 px-4 rounded-xl gap-2',
    lg: 'text-sm sm:text-base py-3.5 px-6 rounded-xl gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.navy} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Reusable FormInput with accessible focus states and consistent borders
 */
export const FormInput = React.forwardRef(({
  label,
  error,
  helper,
  required = false,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-[#00203d] mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#00203d] placeholder:text-[#6b99ab]/60 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-[#3b7a8c] focus:border-transparent ${
          error
            ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
            : 'border-[#a1c0d1] bg-white hover:border-[#6b99ab]'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-[11px] text-[#6b99ab] mt-1 leading-normal">
          {helper}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

/**
 * Reusable FormSelect with bespoke ChevronDown icon and clean hover/focus
 */
export const FormSelect = React.forwardRef(({
  label,
  error,
  helper,
  required = false,
  className = '',
  children,
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-[#00203d] mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={`w-full px-3.5 py-2.5 appearance-none rounded-xl border text-sm text-[#00203d] transition-all duration-200 ease-out cursor-pointer pr-9 focus:outline-none focus:ring-2 focus:ring-[#3b7a8c] focus:border-transparent ${
            error
              ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-rose-400'
              : 'border-[#a1c0d1] bg-white hover:border-[#6b99ab]'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#6b99ab]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-[11px] text-[#6b99ab] mt-1 leading-normal">
          {helper}
        </p>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

/**
 * Reusable SectionBadge for standardizing top section tags
 */
export const SectionBadge = ({
  tag,
  title,
  subtitle,
  className = '',
  action = null
}) => {
  return (
    <div className={`pb-3.5 border-b border-[#a1c0d1]/40 mb-4 flex items-start sm:items-center justify-between gap-3 ${className}`}>
      <div>
        {tag && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b7a8c] block mb-0.5">
            {tag}
          </span>
        )}
        {title && (
          <h2 className="text-xl sm:text-2xl font-black text-[#00203d] tracking-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs text-[#1f4f5a] mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

