"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string, mode: "id" | "name") => void;
  isLoading: boolean;
}

const EXAMPLE_IDS = [
  { query: "Inception",    label: "Inception"           },
  { query: "Interstellar", label: "Interstellar"        },
  { query: "tt0068646",    label: "The Godfather (ID)"  },
  { query: "tt0133093",    label: "The Matrix (ID)"     },
];

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [error, setError]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  function validate(input: string): string {
  if (!input.trim()) return "Please enter a movie name or IMDb ID.";
  if (input.trim().length < 2) return "Query must be at least 2 characters.";
  return "";
};
  
  function detectMode(input: string): "id" | "name" {
  return /^tt\d{7,8}$/i.test(input.trim()) ? "id" : "name";
}

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = validate(value);
    if (msg) { setError(msg); return; }
    setError("");
    onSearch(value.trim(), detectMode(value));
  }

  function handleExample(id: string) {
    setValue(id);
    setError("");
    onSearch(id, detectMode(id));
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="relative group">
          {/* Glow ring on focus */}
          <div
            className="absolute -inset-px rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #f59e0b55, #d9770633)" }}
          />

          <div className="relative flex items-center bg-[#18181c] border border-[#2a2a30] rounded-2xl overflow-hidden">
            {/* Film reel icon */}
            <span className="pl-5 pr-3 text-[#f59e0b] opacity-70 shrink-0" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                <line x1="12" y1="2"  x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="2"  y1="12" x2="5"  y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
              </svg>
            </span>

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              placeholder="Search by movie name  or  IMDb ID (tt...)"
              disabled={isLoading}
              aria-label="IMDb movie ID"
              aria-describedby={error ? "search-error" : undefined}
              className="flex-1 bg-transparent py-4 px-2 text-base text-[#e5e7eb] placeholder:text-[#4b5563] outline-none disabled:opacity-50 font-body tracking-wide"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="m-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#0a0a0b",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingDots /> Analyzing
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </div>

        {/* Inline error */}
        {error && (
          <p id="search-error" role="alert" className="mt-3 text-sm text-red-400 flex items-center gap-2 pl-1">
            <span>⚠</span> {error}
          </p>
        )}
      </form>

      {/* Example chips */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-[#6b7280] pt-1">Try:</span>
        {EXAMPLE_IDS.map(({ query, label }) => (
          <button
            key={query}
            onClick={() => handleExample(query)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full border border-[#2a2a30] text-[#9ca3af] hover:border-[#f59e0b] hover:text-[#f59e0b] transition-colors duration-200 disabled:opacity-40"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          style={{ animation: `pulse_slow 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}
