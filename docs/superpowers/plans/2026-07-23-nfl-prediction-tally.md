# NFL Prediction Scraper & Tally App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack web application that scrapes predictions for NFL games across Reddit, YouTube, and sports blogs, parses picks using AI, verifies picks against live ESPN scores, and tallies predictor accuracy and game consensus.

**Architecture:** Express.js REST API with SQLite database handling scrapers, AI extraction, and ESPN game verification; React + Vite frontend providing a dark-mode dashboard with leaderboards, matchup consensus bars, and custom URL scraping inputs.

**Tech Stack:** Node.js, Express, SQLite (`better-sqlite3`), Axios, Cheerio, Vitest, React, Vite, Lucide React, Tailwind CSS.

---

### Task 1: Project Setup & Dependencies

**Files:**
- Create: `package.json`
- Create: `server/index.js`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [ ] **Step 1: Initialize Node project and install dependencies**
  - Run: `npm init -y` in `/Users/hardikmalakar/nfl-prediction-tally`
  - Install backend deps: `express`, `cors`, `better-sqlite3`, `axios`, `cheerio`, `dotenv`
  - Install dev deps: `vite`, `@vitejs/plugin-react`, `vitest`, `concurrently`, `tailwindcss`, `postcss`, `autoprefixer`
  - Install frontend deps: `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`

- [ ] **Step 2: Configure Vite and Tailwind CSS**
  - Setup `vite.config.js` with proxy to Express backend (`/api` -> `http://localhost:3001`)
  - Create `tailwind.config.js` and `src/index.css` with dark theme styling tokens.

- [ ] **Step 3: Commit initial project setup**
  - Commit message: `feat: scaffold project structure and configuration`

---

### Task 2: Database Schema & NFL Team Data Seeding

**Files:**
- Create: `server/db/schema.js`
- Create: `server/db/database.js`
- Create: `server/db/seed.js`
- Test: `tests/db.test.js`

- [ ] **Step 1: Write failing database test**
  - Write test for DB initialization, team seeding (32 NFL teams), games creation, and queries.

- [ ] **Step 2: Run test to verify failure**
  - Run `npx vitest run tests/db.test.js`

- [ ] **Step 3: Implement SQLite DB initialization & 32 NFL Team Seeding**
  - Create SQLite database schema (teams, games, sources, predictions).
  - Seed all 32 NFL teams with logos, colors, names, and abbreviations.

- [ ] **Step 4: Run test to verify pass**
  - Run `npx vitest run tests/db.test.js`

- [ ] **Step 5: Commit DB setup**
  - Commit message: `feat: implement SQLite schema and NFL team seeding`

---

### Task 3: ESPN Scoreboard API Integration & Winner Verification Worker

**Files:**
- Create: `server/services/espnService.js`
- Create: `server/services/verifier.js`
- Test: `tests/espnService.test.js`

- [ ] **Step 1: Write test for ESPN API fetch and game status parser**
  - Mock ESPN API JSON response with final and upcoming games.
  - Verify game creation/update logic and prediction result evaluation (`CORRECT` / `INCORRECT`).

- [ ] **Step 2: Run test to verify failure**
  - Run `npx vitest run tests/espnService.test.js`

- [ ] **Step 3: Implement ESPN Scoreboard Service**
  - Fetch scores from `site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`.
  - Parse teams, scores, status, and set winner IDs.
  - Evaluate pending predictions against final game outcomes.

- [ ] **Step 4: Run test to verify pass**
  - Run `npx vitest run tests/espnService.test.js`

- [ ] **Step 5: Commit ESPN service**
  - Commit message: `feat: add ESPN API integration and score verification worker`

---

### Task 4: Multi-Source Scrapers (Reddit, YouTube, Web)

**Files:**
- Create: `server/scrapers/redditScraper.js`
- Create: `server/scrapers/youtubeScraper.js`
- Create: `server/scrapers/webScraper.js`
- Test: `tests/scrapers.test.js`

- [ ] **Step 1: Write tests for Reddit, YouTube, and Web scrapers**
  - Test scraping Reddit JSON API (`/r/nfl/hot.json` or `.json` thread URLs).
  - Test YouTube video description/metadata extraction.
  - Test Web article text extraction with Cheerio.

- [ ] **Step 2: Run scraper tests to verify failure**
  - Run `npx vitest run tests/scrapers.test.js`

- [ ] **Step 3: Implement Scrapers**
  - Implement Reddit JSON fetcher for subreddits and custom links.
  - Implement YouTube video/channel metadata fetcher.
  - Implement Cheerio web scraper.

- [ ] **Step 4: Run scraper tests to verify pass**
  - Run `npx vitest run tests/scrapers.test.js`

- [ ] **Step 5: Commit scrapers**
  - Commit message: `feat: implement Reddit, YouTube, and Web article scrapers`

---

### Task 5: AI Pick Parser Engine

**Files:**
- Create: `server/services/aiParser.js`
- Test: `tests/aiParser.test.js`

- [ ] **Step 1: Write test for AI Pick Extractor**
  - Test NLP pick parsing on sentences like "Chiefs beat Ravens 24-20", "I'm locking in the 49ers", "Take Philadelphia over Dallas".

- [ ] **Step 2: Run test to verify failure**
  - Run `npx vitest run tests/aiParser.test.js`

- [ ] **Step 3: Implement AI Pick Parser Engine**
  - Hybrid regex + heuristic entity matcher with API fallback for matching team names & pick confidence.
  - Standardizes raw picks to canonical NFL team IDs.

- [ ] **Step 4: Run test to verify pass**
  - Run `npx vitest run tests/aiParser.test.js`

- [ ] **Step 5: Commit AI Parser**
  - Commit message: `feat: implement AI pick parser and team entity matching engine`

---

### Task 6: Express REST API Endpoints

**Files:**
- Create: `server/routes/api.js`
- Test: `tests/api.test.js`

- [ ] **Step 1: Write API endpoint tests**
  - Test `GET /api/games` (Weekly matchups with consensus splits).
  - Test `GET /api/leaderboard` (Ranked predictors with win rates).
  - Test `GET /api/predictions` (List predictions with source info).
  - Test `POST /api/scrape` (Trigger url or subreddit scrape).

- [ ] **Step 2: Run API tests to verify failure**
  - Run `npx vitest run tests/api.test.js`

- [ ] **Step 3: Implement Express API routes**
  - Connect database queries and services to API routes.

- [ ] **Step 4: Run API tests to verify pass**
  - Run `npx vitest run tests/api.test.js`

- [ ] **Step 5: Commit API endpoints**
  - Commit message: `feat: implement Express REST API endpoints`

---

### Task 7: React Dashboard Frontend UI

**Files:**
- Create: `src/App.jsx`
- Create: `src/components/Header.jsx`
- Create: `src/components/MatchupGrid.jsx`
- Create: `src/components/MatchupCard.jsx`
- Create: `src/components/Leaderboard.jsx`
- Create: `src/components/ScraperHub.jsx`
- Create: `src/components/PredictionsList.jsx`
- Create: `src/services/apiClient.js`

- [ ] **Step 1: Build API client module**
  - Implement fetch calls for games, leaderboards, predictions, and scrape triggers.

- [ ] **Step 2: Build UI Components**
  - Build Header with active week, total scraped predictions, and crowd accuracy meter.
  - Build MatchupGrid & MatchupCard showing team logos, odds, and visual Consensus Pick Bar (% Team A vs % Team B).
  - Build Predictor Leaderboard table with filtering by platform, win %, and pick count.
  - Build ScraperHub with custom URL submission form, preset source triggers, and live activity log.
  - Build PredictionsList inspector showing quote snippets, source links, and verification status.

- [ ] **Step 3: Connect components in App.jsx**

- [ ] **Step 4: Commit UI components**
  - Commit message: `feat: implement modern React dashboard UI with consensus bars and leaderboards`

---

### Task 8: End-to-End Verification & Initial Seed Data

**Files:**
- Create: `server/scripts/seedPredictions.js`
- Test: `tests/e2e.test.js`

- [ ] **Step 1: Write E2E test verifying full flow**
  - Test: Scrape sample content -> AI parse -> Store predictions -> Fetch ESPN scoreboard -> Verify winners -> Verify leaderboard updates.

- [ ] **Step 2: Run E2E test and verify clean pass**
  - Run `npx vitest run tests/e2e.test.js`

- [ ] **Step 3: Seed initial real-world NFL games and predictions**

- [ ] **Step 4: Final commit and verify server/app build**
  - Commit message: `feat: complete NFL prediction scraper app with full E2E verification`
