import React from 'react';

export function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerBorder = false,
  padding = 'p-5 sm:p-6',
  variant = 'default', // 'default', 'neon', 'purple', 'glass'
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'neon':
        return 'bg-[#9AF04F] text-[#0A0D06] border-transparent shadow-neon-glow';
      case 'purple':
        return 'bg-gradient-to-br from-[#1B112B] via-[#140D22] to-[#0D0917] text-white border-[#9655F5]/30 shadow-purple-glow';
      case 'glass':
        return 'glass-panel text-white';
      default:
        return 'bg-[#11131B] dark:bg-[#11131B] text-slate-100 border border-white/[0.07] hover:border-white/[0.12] shadow-card-dark';
    }
  };

  const isNeon = variant === 'neon';

  return (
    <div
      className={`rounded-3xl transition-all duration-200 relative overflow-hidden ${getVariantStyles()} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div
          className={`flex items-center justify-between gap-4 px-5 sm:px-6 pt-5 pb-3 ${
            headerBorder
              ? isNeon
                ? 'border-b border-black/10'
                : 'border-b border-white/[0.06]'
              : ''
          }`}
        >
          <div>
            {title && (
              <h3
                className={`text-base font-semibold tracking-tight ${
                  isNeon ? 'text-[#0A0D06]' : 'text-slate-100'
                }`}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={`text-xs mt-0.5 ${
                  isNeon ? 'text-black/70' : 'text-slate-400'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
}
