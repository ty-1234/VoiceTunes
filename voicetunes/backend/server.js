const express = require('express');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const cors = require('cors');
const { google } = require('googleapis');
const speech = require('@google-cloud/speech');
const { WebSocketServer } = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Google API clients
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

// Utility: Search YouTube
async function searchYouTube(query) {
  const response = await youtube.search.list({
    part: 'snippet',
    q: query + ' music',
    type: 'video',
    maxResults: 5,
    videoCategoryId: '10',
  });

  return response.data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
  }));
}

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'text-search') {
        const { query, useMoodSearch } = data;  // new flag to control search mode

        let searchQuery = query;
        let mood = null;
        let moodScore = 0;

        if (useMoodSearch) {
          // Analyze sentiment and map to expanded mood range
          const sentimentResult = sentiment.analyze(query);
          moodScore = sentimentResult.score;

          // Expanded mood mapping
          if (moodScore >= 4) mood = 'very happy';
          else if (moodScore > 1) mood = 'happy';
          else if (moodScore >= -1 && moodScore <= 1) mood = 'neutral';
          else if (moodScore > -4) mood = 'sad';
          else mood = 'angry';

          // Send mood info to client
          ws.send(JSON.stringify({
            type: 'mood',
            mood,
            score: moodScore,
            message: `Detected mood: ${mood} (score: ${moodScore})`
          }));

          searchQuery = mood;  // use mood as search query
          ws.send(JSON.stringify({ type: 'processing', message: `Searching for ${mood} music...` }));
        } else {
          // Manual search
          ws.send(JSON.stringify({ type: 'processing', message: `Searching for "${query}"...` }));
        }

        // Perform YouTube search
        const results = await searchYouTube(searchQuery);
        ws.send(JSON.stringify({ type: 'search-results', results }));
      }

    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP/WebSocket server running on port ${PORT}`);
});
