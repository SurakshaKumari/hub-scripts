"use client";

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search scripts, games...', initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <svg className="absolute left-4 w-4 h-4 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-[#141414] border border-gray-800 hover:border-gray-700 focus:border-red-600 text-white rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none placeholder-gray-600 transition-all focus:shadow-lg focus:shadow-red-600/10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-600 hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}
