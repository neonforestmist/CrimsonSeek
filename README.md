# CrimsonSeek

<p>
  <img src="./public/linkup-logo.svg" alt="Linkup" height="34" />
</p>

CrimsonSeek is an investigative search dashboard for seeing what the web actually says about a topic. It turns a query into a sourced answer, public read, source table, image evidence, and report-ready PDF export.

Linkup is the retrieval backbone. CrimsonSeek uses Linkup for fresh web results, citations, structured fields, and image evidence.

## Features

- Search by effort: Fast, Standard, or Deep.
- Filter by time window and specific sites.
- Review sourced answers, themes, citations, image evidence, and public read.
- Open preloaded demo reports generated from Linkup results.
- Export curated PDF reports.

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` or `.env.local`:

```env
LINKUP_API_KEY=your_key_here
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Reports

Preloaded demo report data lives in `lib/demo-cache.json`.

Refresh it with:

```bash
npm run sync:demos
```

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm start` serves the production build.
- `npm run typecheck` checks TypeScript.
- `npm run sync:demos` refreshes demo report data from Linkup.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS v4, Linkup Search API, and Typst-powered PDF exports.
