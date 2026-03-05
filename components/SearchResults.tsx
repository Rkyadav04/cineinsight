"use client";

import Image from "next/image";
import { MovieSearchResult } from "@/lib/omdb";

interface Props {
  results:  MovieSearchResult[];
  onSelect: (imdbId: string) => void;
  query:    string;
}

export default function SearchResults({ results, onSelect, query }: Props) {
  return (
    <div className="animate-fade-up rounded-2xl border border-[#2a2a30] overflow-hidden"
         style={{ background: "#111113" }}>
      <div className="px-6 py-4 border-b border-[#2a2a30]">
        <h3 className="text-sm font-semibold text-[#e5e7eb]">
          {results.length} results for &ldquo;{query}&rdquo;
        </h3>
        <p className="text-xs text-[#6b7280] mt-0.5">Select a movie to get AI insights</p>
      </div>

      <ul className="divide-y divide-[#2a2a30]">
        {results.map((movie) => (
          <li key={movie.imdbID}>
            <button onClick={() => onSelect(movie.imdbID)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#18181c] group transition-colors">
              <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-[#2a2a30]">
                <img src={movie.poster || ""} alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.25rem;opacity:0.2">🎞</div>`;
                    }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#e5e7eb] truncate group-hover:text-[#f59e0b] transition-colors">
                  {movie.title}
                </p>
                <p className="text-xs text-[#6b7280] mt-0.5">{movie.year} · <span className="font-mono">{movie.imdbID}</span></p>
              </div>
              <svg className="w-4 h-4 text-[#374151] group-hover:text-[#f59e0b] transition-colors shrink-0"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}