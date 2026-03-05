"use client";

import { useState, useCallback } from "react";
import SearchBar      from "@/components/SearchBar";
import MovieCard      from "@/components/MovieCard";
import SentimentDisplay from "@/components/SentimentDisplay";
import LoadingSkeleton  from "@/components/LoadingSkeleton";
import { MovieInsightResponse } from "@/types/movie";
import { MovieSearchResult } from "@/lib/omdb";
import SearchResults from "@/components/SearchResults";

type AppState = "idle" | "loading" | "success" | "error" | "results";

export default function HomePage() {
  const [state,  setState]  = useState<AppState>("idle");
  const [data,   setData]   = useState<MovieInsightResponse | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [results,     setResults]     = useState<MovieSearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


const handleSearch = useCallback(async (query: string, mode: "id" | "name") => {
    setState("loading");
    setData(null);
    setResults([]);
    setErrMsg("");
    setSearchQuery(query);

    try {
      const param = mode === "id"
        ? `id=${encodeURIComponent(query)}`
        : `name=${encodeURIComponent(query)}`;

      const res  = await fetch(`/api/movie?${param}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Something went wrong");

      if (json.results) {
        setResults(json.results);
        setState("results");
      } else {
        setData(json as MovieInsightResponse);
        setState("success");
      }
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Unexpected error");
      setState("error");
    }
  }, []);

const handleSelectMovie = useCallback(async (imdbId: string) => {
    setState("loading");
    setData(null);
    setResults([]);
    setErrMsg("");

    try {
      const res  = await fetch(`/api/movie?id=${encodeURIComponent(imdbId)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setData(json as MovieInsightResponse);
      setState("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Unexpected error");
      setState("error");
    }
  }, []);
  return (
    <main className="min-h-screen relative">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10"
             style={{ background: "radial-gradient(ellipse, #f59e0b 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 sm:py-20">

        {/* Hero header */}
        <header className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6 border"
               style={{ background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>
            ✦ Presented by Rkyadav
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-none mb-4"
              style={{ fontFamily: "var(--font-playfair)", color: "#f9fafb" }}>
            Cine<span style={{ color: "#f59e0b" }}>Insight</span>
          </h1>

          <p className="text-base text-[#6b7280] max-w-md mx-auto leading-relaxed"
             style={{ fontFamily: "var(--font-dm-sans)" }}>
            Enter an IMDb movie ID to unlock AI-powered audience sentiment, cast details, and deep film insights.
          </p>
        </header>

        {/* Search */}
        <div className="animate-fade-up delay-100 mb-10">
          <SearchBar onSearch={handleSearch} isLoading={state === "loading"} />
        </div>

        {/* Loading */}
        {state === "loading" && <LoadingSkeleton />}
        {state === "results" && (<SearchResults results={results} onSelect={handleSelectMovie} query={searchQuery} />)}
            

        {/* Error */}
        {state === "error" && (
          <div className="animate-fade-up rounded-2xl border border-red-900/40 p-6 text-center"
               style={{ background: "rgba(239,68,68,0.06)" }} role="alert">
            <p className="text-2xl mb-2">🎬</p>
            <p className="font-medium text-red-400 mb-1">Something went wrong</p>
            <p className="text-sm text-[#9ca3af]">{errMsg}</p>
          </div>
        )}

        {/* Results */}
        {state === "success" && data && (
          <div className="space-y-4">
            <MovieCard      movie={data.movie}         />
            <SentimentDisplay sentiment={data.sentiment} />

            {/* IMDb link */}
            <div className="animate-fade-up delay-400 text-center pt-2">
              <a
                href={`https://www.imdb.com/title/${data.movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#f59e0b] transition-colors duration-200"
              >
                View on IMDb
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Idle hint */}
        {state === "idle" && (
          <div className="animate-fade-up delay-200 text-center py-16">
            <div className="text-5xl mb-4 opacity-20" aria-hidden>🎥</div>
            <p className="text-sm text-[#4b5563]">Your movie insights will appear here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-xs text-[#374151]"
              style={{ fontFamily: "var(--font-dm-sans)" }}>
        Built with Next.js · Powered by OMDB & TMDB
      </footer>
    </main>
  );
}
