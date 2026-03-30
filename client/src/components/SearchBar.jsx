import React, { useState, useEffect } from 'react';

export default function SearchBar({ placeholder, onSearch, value = '', className = '' }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    onSearch && onSearch(val);
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 transition-all shadow-inner"
      />
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-brand/40 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full blur-[1px]"></div>
    </div>
  );
}
