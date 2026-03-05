"use client";

import { SentimentAnalysis } from "@/types/movie";

interface Props { sentiment: SentimentAnalysis; }

const SENTIMENT_CONFIG = {
  positive: { color: "#4ade80", bg: "rgba(34,197,94,0.08)", ring: "#22c55e", label: "Positive" },
  mixed:    { color: "#facc15", bg: "rgba(234,179,8,0.08)",  ring: "#eab308", label: "Mixed"    },
  negative: { color: "#f87171", bg: "rgba(239,68,68,0.08)",  ring: "#ef4444", label: "Negative" },
};

export default function SentimentDisplay({ sentiment }: Props) {
  const cfg = SENTIMENT_CONFIG[sentiment.label];
  const circumference = 2 * Math.PI * 54; // r=54
  const offset = circumference - (sentiment.score / 100) * circumference;

  return (
    <div className="animate-fade-up delay-300 rounded-2xl border border-[#2a2a30] overflow-hidden"
         style={{ background: "#111113" }}>
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#2a2a30] flex items-center gap-3">
        <span className="text-lg" aria-hidden>🧠</span>
        <h3 className="text-sm font-medium uppercase tracking-widest text-[#6b7280]"
            style={{ fontFamily: "var(--font-dm-sans)" }}>
          AI Sentiment Analysis
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Score ring + label */}
        <div className="flex items-center gap-6">
          <div className="relative shrink-0 w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {/* Track */}
              <circle cx="60" cy="60" r="54" fill="none" stroke="#2a2a30" strokeWidth="8"/>
              {/* Fill */}
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={cfg.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                className="score-ring"
                style={{ "--target-offset": offset } as React.CSSProperties}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: cfg.color, fontFamily: "var(--font-playfair)" }}>
                {sentiment.score}
              </span>
              <span className="text-xs text-[#6b7280]">/ 100</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium badge-${sentiment.label}`}>
              {cfg.label} Reception
            </span>
            <p className="text-sm text-[#9ca3af] leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {sentiment.criticsNote}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}
             className="rounded-r-xl pl-4 pr-4 py-3">
          <p className="text-sm leading-relaxed text-[#d1d5db]" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {sentiment.summary}
          </p>
        </div>

        {/* Highlights */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-3">
            Audience Themes
          </p>
          <div className="flex flex-wrap gap-2">
            {sentiment.highlights.map((h, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-xs border border-[#2a2a30] text-[#9ca3af]"
                style={{ background: "#18181c" }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
