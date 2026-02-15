# VoiceTunes

VoiceTunes is a web application that lets users search for and play music using their voice or text queries. It features real-time music search, YouTube playback, playlists, and audio visualizations. The project is split into a React frontend and a Node.js/Express backend.

---

## Features

- 🎤 **Voice Search:** Search for songs, artists, or moods using your voice.
- 🔍 **Text Search:** Search for music by typing queries.
- 🎵 **Music Playback:** Stream music videos from YouTube.
- 📃 **Playlist Management:** Add, remove, shuffle, and repeat tracks in your playlist.
- 📊 **Audio Visualizer:** Enjoy dynamic visualizations while music plays.
- ⚡ **Real-time Communication:** Uses WebSockets for instant search and playback updates.
- 💡 **Mood Detection:** (Optional) Detects mood from queries and suggests music.

---

## Project Structure

```
voicetunes/
  backend/    # Node.js/Express backend (WebSocket + YouTube API)
  frontend/   # React frontend (UI, WebSocket client)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- YouTube Data API key (for backend)
- Google Cloud Speech-to-Text credentials (optional, for advanced features)

### 1. Clone the repository

```sh
git clone https://github.com/your-username/voicetunes.git
cd voicetunes
```

### 2. Backend Setup

```sh
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json
```

Start the backend server:

```sh
npm run dev
```

### 3. Frontend Setup

```sh
cd ../frontend
npm install
npm start
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---
<img width="1893" height="885" alt="image" src="https://github.com/user-attachments/assets/e8697942-a83d-4974-b590-225954a1b394" />

## Usage

- Click the microphone to speak your music request, or type in the search bar.
- Browse search results and click to play music.
- Add tracks to your playlist, shuffle, repeat, and manage your queue.
- Enjoy real-time audio visualizations while music plays.

---

## Development

- **Frontend:** React, Tailwind CSS, WebSockets
- **Backend:** Node.js, Express, WebSocket, YouTube Data API, Sentiment Analysis

---

## License

MIT

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
