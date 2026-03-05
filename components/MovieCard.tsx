"use client";

import Image from "next/image";
import { MovieDetails } from "@/types/movie";

interface Props { movie: MovieDetails; }

export default function MovieCard({ movie }: Props) {
  const castList = movie.actors.split(",").map((a) => a.trim()).filter(Boolean);
  const genres   = movie.genre.split(",").map((g) => g.trim()).filter(Boolean);

  return (
    <div className="animate-fade-up delay-200 rounded-2xl border border-[#2a2a30] overflow-hidden"
         style={{ background: "#111113" }}>
      <div className="flex flex-col sm:flex-row">
        {/* Poster */}
        <div className="sm:w-48 shrink-0 bg-[#18181c] relative overflow-hidden">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={`${movie.title} poster`}
              width={192}
              height={288}
              className="w-full h-64 sm:h-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-64 sm:h-full flex items-center justify-center">
              <span className="text-4xl opacity-20">🎬</span>
            </div>
          )}
          {/* Rating pill overlay */}
          {movie.imdbRating !== "N/A" && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                 style={{ background: "rgba(10,10,11,0.85)", color: "#f59e0b", backdropFilter: "blur(8px)" }}>
              ★ {movie.imdbRating}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex-1 p-6 space-y-4">
          {/* Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{ fontFamily: "var(--font-playfair)", color: "#f9fafb" }}>
              {movie.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="text-[#6b7280] text-sm">{movie.year}</span>
              {movie.rated !== "N/A" && (
                <span className="text-xs px-2 py-0.5 rounded border border-[#2a2a30] text-[#9ca3af]">
                  {movie.rated}
                </span>
              )}
              <span className="text-[#6b7280] text-sm">{movie.runtime}</span>
            </div>
          </div>

          {/* Genre pills */}
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <span key={g} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                {g}
              </span>
            ))}
          </div>

          {/* Plot */}
          <p className="text-sm text-[#9ca3af] leading-relaxed line-clamp-4"
             style={{ fontFamily: "var(--font-dm-sans)" }}>
            {movie.plot}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <Stat label="Director" value={movie.director} />
            {movie.metascore !== "N/A" && <Stat label="Metascore" value={`${movie.metascore} / 100`} />}
            <Stat label="IMDb Votes" value={movie.imdbVotes} />
          </div>

          {/* Awards */}
          {movie.awards !== "N/A" && (
            <p className="text-xs text-[#6b7280] flex items-center gap-1.5">
              <span>🏆</span>{movie.awards}
            </p>
          )}
        </div>
      </div>

      {/* Cast strip */}
      <div className="px-6 pb-6">
        <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-3">Cast</p>
        <div className="flex flex-wrap gap-2">
          {castList.map((actor) => (
            <span key={actor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-[#d1d5db]"
                  style={{ background: "#18181c", border: "1px solid #2a2a30" }}>
              <span className="text-[#f59e0b] text-xs">◆</span>
              {actor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "#18181c" }}>
      <p className="text-[10px] uppercase tracking-wider text-[#6b7280] mb-1">{label}</p>
      <p className="text-sm font-medium text-[#e5e7eb] leading-snug truncate"
         style={{ fontFamily: "var(--font-dm-sans)" }}>
        {value}
      </p>
    </div>
  );
}
