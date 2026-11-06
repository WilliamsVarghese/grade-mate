import React from 'react';

export function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  placeholder,
  ...props
}) {
  const selectId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          {label}
          {required && <span className="text-[#9AF04F] ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full rounded-2xl border text-sm transition-all outline-none py-2.5 px-4 bg-[#151824] text-white disabled:opacity-50 disabled:bg-[#0E1018] ${
          error
            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
            : 'border-white/[0.08] focus:border-[#9AF04F] focus:ring-1 focus:ring-[#9AF04F]'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#151824] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
