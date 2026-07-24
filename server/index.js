import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { initDatabase, seedTeams } from './db/database.js';
import { seedSamplePredictions } from './scripts/seedData.js';
import { syncEspnGames } from './services/espnService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database, Teams & Predictions
initDatabase();
seedTeams();
seedSamplePredictions();

// Initial ESPN score sync in background
syncEspnGames().then(synced => {
  console.log(`[ESPN Sync] Successfully synced ${synced.length} games from ESPN API.`);
}).catch(err => {
  console.error('[ESPN Sync Error]', err.message);
});

// API Routes
app.use('/api', apiRouter);

// Serve static frontend bundle in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`🏈 Gridiron & Pitch Oracle Server running on port ${PORT}`);
});
