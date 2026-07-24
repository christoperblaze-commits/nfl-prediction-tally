# NFL Prediction Scraper & Tally App — Design Specification

**Date**: 2026-07-23  
**Status**: Approved  

---

## 1. Executive Summary

The **NFL Prediction Scraper & Tally App** automatically discovers, parses, aggregates, and verifies community and expert predictions for NFL games across Reddit, YouTube, and online sports blogs. Using AI-assisted text extraction paired with live ESPN Scoreboard API data, the platform tracks prediction accuracy, maintains predictor leaderboards, and provides community consensus picks for every NFL matchup.

---

## 2. Core Features & Capabilities

1. **Multi-Source Scraper Engine**:
   - **Reddit**: Scrapes posts, titles, and top comments from subreddits like `r/nfl`, `r/sportsbook`, `r/NFLpickem`, or user-supplied thread URLs.
   - **YouTube**: Scrapes video metadata, descriptions, and transcripts from prediction channels/videos.
   - **Web Articles**: Parses sports blogs and article content via Cheerio.
2. **AI Pick Parser**:
   - Uses structured LLM prompt parsing to turn unstructured text ("I think KC takes it by a field goal over Baltimore") into structured prediction objects.
   - Standardizes team names to official NFL team entities.
3. **Live ESPN Verification Engine**:
   - Integrates with ESPN public endpoints (`site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`).
   - Automatically checks finished game outcomes against predictions to mark status (`CORRECT`, `INCORRECT`, `PUSH`).
4. **Leaderboard & Consensus Analytics**:
   - Aggregates consensus win percentage split for each upcoming matchup (e.g. 72% Chiefs vs 28% Ravens).
   - Ranks top individual predictors, subreddits, and YouTube channels on a live accuracy leaderboard.
5. **Interactive Scraper Hub & URL Submission**:
   - Custom URL input allowing users to trigger instant scraping & AI extraction on any Reddit link, YouTube link, or web article.
   - Live activity feed showing scraping logs and extracted picks in real time.

---

## 3. System Architecture & Tech Stack

```
+------------------+         +-------------------------------+         +-----------------------+
|  Scraper Inputs  |         |   Express Server (Node.js)    |         | React Dashboard (Vite)|
|  - Reddit JSON   +---------> - Scraper Controllers           +---------> - Matchups Hub        |
|  - YouTube Data  |         - AI Pick Parser Engine         |         - Leaderboard           |
|  - Web HTML      |         - ESPN Game Verifier            |         - Scraper Manager       |
+------------------+         +---------------+---------------+         +-----------------------+
                                             |
                                             v
                                     +-------+-------+
                                     | SQLite DB     |
                                     +---------------+
```

* **Frontend**: React (Vite), Tailwind CSS / Vanilla CSS, Lucide Icons, Recharts for pick distribution charts.
* **Backend**: Node.js, Express, SQLite (`better-sqlite3` or `sqlite3`).
* **Scraper Tools**: `axios`, `cheerio`, `youtube-transcript` / API wrappers.
* **Parser**: AI LLM parser module with JSON output schema validation.

---

## 4. Database Schema (SQLite)

```sql
CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  logo_url TEXT
);

CREATE TABLE games (
  id TEXT PRIMARY KEY,
  espn_id TEXT UNIQUE,
  season INTEGER NOT NULL,
  week INTEGER NOT NULL,
  home_team_id TEXT REFERENCES teams(id),
  away_team_id TEXT REFERENCES teams(id),
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'SCHEDULED', -- SCHEDULED, IN_PROGRESS, FINAL
  winner_team_id TEXT REFERENCES teams(id),
  game_date DATETIME NOT NULL
);

CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL, -- REDDIT, YOUTUBE, WEB
  url TEXT UNIQUE NOT NULL,
  author_name TEXT,
  title TEXT,
  scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predictions (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES sources(id),
  game_id TEXT REFERENCES games(id),
  predictor_name TEXT NOT NULL,
  picked_team_id TEXT REFERENCES teams(id),
  quote_snippet TEXT,
  confidence TEXT DEFAULT 'MEDIUM',
  status TEXT DEFAULT 'PENDING' -- PENDING, CORRECT, INCORRECT, PUSH
);
```

---

## 5. Verification Logic

1. When ESPN API reports a game state `STATUS_FINAL`:
   - Game `winner_team_id` is determined by comparing `home_score` vs `away_score`.
   - Update `games` row: `status = 'FINAL'`, `winner_team_id = winner_id`.
2. Query all `predictions` where `game_id = finished_game_id`:
   - If `picked_team_id == winner_team_id`: `prediction.status = 'CORRECT'`
   - Else: `prediction.status = 'INCORRECT'`
3. Compute leaderboards:
   - Group by `predictor_name` to calculate `total_picks`, `correct_picks`, and `win_rate_percentage`.

---

## 6. Testing & Quality Strategy

- **Scraper Unit Tests**: Mock HTTP responses for Reddit JSON, YouTube API, and Web pages.
- **Parser Unit Tests**: Test AI pick extractor against sample sentences (e.g. edge cases, nickname variations, underdog spreads).
- **ESPN Verifier Integration Test**: Test scoreboard parser and winner scoring logic.
- **E2E / API Integration Tests**: Test prediction tally updates and REST API endpoints.
