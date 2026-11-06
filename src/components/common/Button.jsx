import React from 'react';

const VARIANTS = {
  neon:
    'bg-[#9AF04F] hover:bg-[#8DE840] active:bg-[#7ACB2F] text-[#0A0D06] font-bold shadow-neon-sm hover:shadow-neon-glow focus-visible:ring-[#9AF04F]',
  purple:
    'bg-[#9655F5] hover:bg-[#8544E5] active:bg-[#7534D4] text-white font-bold shadow-purple-glow focus-visible:ring-[#9655F5]',
  primary:
    'bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] font-bold shadow-neon-sm hover:shadow-neon-glow focus-visible:ring-[#9AF04F]',
  dark:
    'bg-[#181B26] hover:bg-[#222636] active:bg-[#282C3E] text-slate-100 border border-white/[0.08] focus-visible:ring-slate-500',
  secondary:
    'bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.15] text-slate-200 border border-white/[0.06] focus-visible:ring-slate-400',
  outline:
    'border border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.05] text-slate-200 focus-visible:ring-slate-400',
  ghost:
    'text-slate-400 hover:text-slate-100 hover:bg-white/[0.07] focus-visible:ring-slate-400',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white shadow-sm focus-visible:ring-rose-500 font-semibold',
  dangerOutline:
    'border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 focus-visible:ring-rose-500',
  subtle:
    'bg-[#9AF04F]/10 text-[#9AF04F] hover:bg-[#9AF04F]/20 border border-[#9AF04F]/20',
};

const SIZES = {
  xs: 'text-xs px-3 py-1.5 rounded-full gap-1.5',
  sm: 'text-xs sm:text-sm px-4 py-2 rounded-full gap-2 font-medium',
  md: 'text-sm px-5 py-2.5 rounded-full gap-2 font-medium',
  lg: 'text-base px-6 py-3 rounded-full gap-2.5 font-bold',
};

const CIRCULAR_SIZES = {
  xs: 'w-8 h-8 rounded-full p-0 flex items-center justify-center',
  sm: 'w-10 h-10 rounded-full p-0 flex items-center justify-center',
  md: 'w-12 h-12 rounded-full p-0 flex items-center justify-center',
  lg: 'w-14 h-14 rounded-full p-0 flex items-center justify-center',
};

export function Button({
  children,
  variant = 'neon',
  size = 'md',
  circular = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) {
  const variantStyles = VARIANTS[variant] || VARIANTS.neon;
  const sizeStyles = circular
    ? CIRCULAR_SIZES[size] || CIRCULAR_SIZES.md
    : SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={circular ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={circular ? 'w-5 h-5 shrink-0' : 'w-4 h-4 shrink-0'} />
      )}
    </button>
  );
}
