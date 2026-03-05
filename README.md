# CineInsight — AI Movie Insight Builder

A full-stack Next.js application that takes an IMDb movie ID and returns movie details, cast, ratings, plot, and an **AI-generated audience sentiment analysis**.

---

## Live Demo

> Deploy to Vercel (see instructions below) and paste your live URL here.

---

## Features

- Movie title, poster, cast, release year, runtime, genre
- IMDb rating, Metascore, awards
- Full plot summary
- AI sentiment analysis (positive / mixed / negative) with score ring, narrative summary, key audience themes
- Responsive design (mobile + desktop)
- Input validation with helpful error messages
- Quick-pick example movie chips
- Skeleton loading states
- Film-grain cinematic dark UI

---

## Tech Stack

| Layer    | Technology       | Why                                                                                       |
|----------|------------------|-------------------------------------------------------------------------------------------|
| Frontend | Next.js 14 (React App Router) | Co-locates frontend and API routes in one repo; no separate server needed    |
| Backend  | Next.js API Routes (Node.js) | Serverless functions on Vercel — no separate Express server needed            |
| Data     | OMDB API         | Free, accepts IMDb IDs directly, returns structured JSON with poster URLs                 |
| AI       | Gemini API | Generates structured sentiment JSON; knowledge of film reception is reliable |
| Styling  | Tailwind CSS     | Utility-first, fast iteration, no CSS file overhead                                       |
| Language | TypeScript       | Type safety across API shapes, components, and utility functions                          |

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- OMDB API key (free at [omdbapi.com](https://www.omdbapi.com/apikey.aspx))
- Gemini API key (at [console.gemini.com](https://console.gemini.com))

### Local Development

```bash
# 1. Clone / unzip the project
cd ai-movie-insight

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in OMDB_API_KEY and ANTHROPIC_API_KEY

# 4. Run the dev server
npm run dev
# Open http://localhost:3000
```

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```

---

## Deployment (Vercel — Recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Under **Settings → Environment Variables**, add:
   - `OMDB_API_KEY`
   - `GEMINI_API_KEY`
4. Click **Deploy**. Done — Vercel handles Next.js automatically.

---

## Project Structure

```
ai-movie-insight/
├── app/
│   ├── layout.tsx           # Root layout with fonts & metadata
│   ├── page.tsx             # Main client page (state, search, results)
│   ├── globals.css          # Tailwind + custom animations & grain
│   └── api/
│       ├── movie/route.ts   # GET /api/movie?id=tt... (main endpoint)
│       └── sentiment/route.ts # POST /api/sentiment (standalone re-analysis)
├── components/
│   ├── SearchBar.tsx        # Input with validation + example chips
│   ├── MovieCard.tsx        # Poster, metadata, cast display
│   ├── SentimentDisplay.tsx # Score ring, badge, summary, themes
│   └── LoadingSkeleton.tsx  # Shimmer skeleton while loading
├── lib/
│   ├── omdb.ts              # OMDB API client + ID validation
│   └── gemini.ts            # Gemini SDK client + prompt
├── types/
│   └── movie.ts             # Shared TypeScript interfaces
└── __tests__/
    ├── validation.test.ts   # Unit tests for isValidImdbId
    └── sentiment.test.ts    # Unit tests for score-to-bucket logic
```

---

## API Reference

### `GET /api/movie?id=<imdbId>`

Returns full movie details + AI sentiment in one call.

**Example:** `GET /api/movie?id=tt0133093`

**Success (200):**
```json
{
  "movie": { "title": "The Matrix", "year": "1999", ... },
  "sentiment": {
    "label": "positive",
    "score": 91,
    "summary": "...",
    "highlights": ["groundbreaking visuals", "philosophical depth", "iconic performances"],
    "criticsNote": "..."
  }
}
```

**Error (400/404/500):**
```json
{ "error": "Invalid IMDb ID format. Expected format: tt followed by 7-8 digits" }
```

---

## Assumptions

- OMDB free tier (1,000 requests/day) is sufficient for evaluation purposes. For production, upgrade to the $1/month tier.
- Gemini training data contains reliable knowledge of mainstream films' critical and audience reception, making it a valid substitute for live review scraping (which would require bypassing rate limits and Terms of Service on sites like IMDb and Rotten Tomatoes).
- The `next: { revalidate: 3600 }` cache on OMDB fetch reduces repeat API calls for the same movie.
