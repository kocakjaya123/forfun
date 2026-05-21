import React from 'react';

export default function CustomSelect({ value, onChange, children, className = '', ...rest }) {
  const base = 'w-full p-3 rounded bg-white/5 border border-transparent focus:outline-none';
  const dark = 'dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600';
  return (
    <select value={value} onChange={onChange} className={`${base} ${dark} ${className}`} {...rest}>
      {children}
    </select>
  );
}
