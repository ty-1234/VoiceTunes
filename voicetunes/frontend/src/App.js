// import React, { useState, useEffect, useRef } from 'react';
// import { Mic, MicOff, Play, Pause, Search, Volume2 } from 'lucide-react';

// const VoiceTunes = () => {
//   const [ws, setWs] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [transcription, setTranscription] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [status, setStatus] = useState('Ready to listen...');
//   const [searchQuery, setSearchQuery] = useState('');

//   const recognitionRef = useRef(null);
//   const playerRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   useEffect(() => {
//     connectWebSocket();
//     return () => {
//       if (ws) ws.close();
//       if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
//     };
//   }, []);

//   const connectWebSocket = () => {
//     try {
//       const websocket = new WebSocket('ws://localhost:5000');

//       websocket.onopen = () => {
//         setIsConnected(true);
//         setStatus('Connected! Ready to listen...');
//         setWs(websocket);
//       };

//       websocket.onclose = () => {
//         setIsConnected(false);
//         setStatus('Disconnected - Attempting to reconnect...');
//         reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
//       };

//       websocket.onerror = (error) => {
//         setStatus('Connection error');
//         console.error('WebSocket error:', error);
//       };

//       websocket.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           handleWebSocketMessage(data);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };
//     } catch (error) {
//       setStatus('Failed to connect');
//       console.error('WebSocket connection error:', error);
//     }
//   };

//   const handleWebSocketMessage = (data) => {
//     switch (data.type) {
//       case 'processing':
//         setStatus(data.message);
//         break;
//       case 'transcription':
//         setTranscription(data.text);
//         setStatus(`Heard: "${data.text}" - Searching...`);
//         break;
//       case 'search-results':
//         setSearchResults(data.results);
//         setStatus(`Found ${data.results.length} results`);
//         break;
//       case 'error':
//         setStatus(`Error: ${data.message}`);
//         break;
//       default:
//         console.log('Unknown message type:', data.type);
//     }
//   };

//   const sendWebSocketMessage = (type, payload) => {
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ type, ...payload }));
//     } else {
//       setStatus('Not connected to server');
//     }
//   };

//   const startRecording = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setStatus('Speech recognition not supported in this browser.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;

//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () => {
//       setIsRecording(true);
//       setStatus('Listening... Speak now!');
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setStatus(`Error: ${event.error}`);
//       setIsRecording(false);
//     };

//     recognition.onresult = (event) => {
//       const spokenText = event.results[0][0].transcript;
//       setTranscription(spokenText);
//       setStatus(`Heard: "${spokenText}" - Searching...`);
//       sendWebSocketMessage('text-search', { query: spokenText });
//     };

//     recognition.onend = () => {
//       setIsRecording(false);
//       setStatus('Stopped listening.');
//     };

//     recognition.start();
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   const handleTextSearch = () => {
//     if (searchQuery.trim()) {
//       sendWebSocketMessage('text-search', { query: searchQuery });
//       setStatus('Searching...');
//     }
//   };

//   const playVideo = (video) => {
//     setCurrentVideo(video);
//     setIsPlaying(true);
//     setStatus(`Now playing: ${video.title}`);
//   };

//   const togglePlayback = () => {
//     if (playerRef.current) {
//       if (isPlaying) {
//         playerRef.current.pauseVideo();
//         setIsPlaying(false);
//         setStatus('Paused');
//       } else {
//         playerRef.current.playVideo();
//         setIsPlaying(true);
//         setStatus('Playing');
//       }
//     }
//   };

// const YouTubePlayer = React.memo(({ videoId, onPlayerStateChange }) => {
//   const playerContainerRef = useRef(null);
//   const playerRef = useRef(null);

//   useEffect(() => {
//     let player;
    
//     // Function to clean up the player
//     const cleanupPlayer = () => {
//       if (playerRef.current) {
//         try {
//           playerRef.current.destroy();
//         } catch (e) {
//           console.log('Player already destroyed');
//         }
//         playerRef.current = null;
//       }
      
//       // Clean up the container
//       if (playerContainerRef.current) {
//         while (playerContainerRef.current.firstChild) {
//           playerContainerRef.current.removeChild(playerContainerRef.current.firstChild);
//         }
//       }
//     };

//     function createPlayer() {
//       cleanupPlayer(); // Clean up any existing player first
      
//       if (window.YT && window.YT.Player && playerContainerRef.current) {
//         player = new window.YT.Player(playerContainerRef.current, {
//           height: '300',
//           width: '100%',
//           videoId,
//           events: {
//             onReady: (event) => {
//               playerRef.current = event.target;
//               event.target.playVideo();
//             },
//             onStateChange: (event) => {
//               if (onPlayerStateChange) {
//                 onPlayerStateChange(event.data);
//               }
//             }
//           }
//         });
//       }
//     }

//     if (!window.YT) {
//       const script = document.createElement('script');
//       script.src = 'https://www.youtube.com/iframe_api';
//       document.body.appendChild(script);
//       window.onYouTubeIframeAPIReady = createPlayer;
//     } else {
//       createPlayer();
//     }

//     return () => {
//       cleanupPlayer();
//       if (window.onYouTubeIframeAPIReady === createPlayer) {
//         window.onYouTubeIframeAPIReady = null;
//       }
//     };
//   }, [videoId, onPlayerStateChange]);

//   return <div ref={playerContainerRef} className="w-full"></div>;
// });
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
//       <div className="container mx-auto px-4 py-8 max-w-4xl">
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
//             🎵 VoiceTunes
//           </h1>
//           <p className="text-xl text-gray-300">Voice-activated music discovery</p>
//         </div>

//         <div className="flex items-center justify-center mb-8">
//           <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
//           <span className="text-lg font-medium">{status}</span>
//         </div>

//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
//           <div className="text-center">
//             <button
//               onClick={isRecording ? stopRecording : startRecording}
//               disabled={!isConnected}
//               className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
//                 isRecording 
//                   ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50' 
//                   : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/30'
//               } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
//             >
//               {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
//             </button>
//             <p className="mt-6 text-xl font-medium">
//               {isRecording ? '🎤 Listening...' : '🎵 Click to speak your music request'}
//             </p>
//             {transcription && (
//               <div className="mt-4 p-3 bg-white/10 rounded-lg">
//                 <p className="text-sm text-gray-300 mb-1">You said:</p>
//                 <p className="text-lg font-medium text-blue-300">"{transcription}"</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
//           <h3 className="text-lg font-semibold mb-4 text-center">Or search manually</h3>
//           <div className="flex gap-3">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
//               placeholder="Type to search for music..."
//               className="flex-1 px-4 py-3 bg-white/20 rounded-xl border border-white/30 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all text-white placeholder-gray-300"
//             />
//             <button
//               onClick={handleTextSearch}
//               disabled={!isConnected}
//               className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
//             >
//               <Search size={20} />
//             </button>
//           </div>
//         </div>

//         {currentVideo && (
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-semibold">🎵 Now Playing</h3>
//               <button
//                 onClick={togglePlayback}
//                 className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all transform hover:scale-110"
//               >
//                 {isPlaying ? <Pause size={24} /> : <Play size={24} />}
//               </button>
//             </div>
//             <div className="rounded-xl overflow-hidden">
//               <YouTubePlayer videoId={currentVideo.id} />
//             </div>
//             <div className="mt-4 p-4 bg-white/10 rounded-xl">
//               <p className="font-medium text-lg">{currentVideo.title}</p>
//               <p className="text-gray-400 mt-1">{currentVideo.channelTitle}</p>
//             </div>
//           </div>
//         )}

//         {searchResults.length > 0 && (
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//             <h3 className="text-xl font-semibold mb-6">🔍 Search Results</h3>
//             <div className="grid gap-4">
//               {searchResults.map((video) => (
//                 <div 
//                   key={video.id} 
//                   className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer transform hover:scale-[1.02] border border-white/10"
//                   onClick={() => playVideo(video)}
//                 >
//                   <img 
//                     src={video.thumbnail} 
//                     alt={video.title} 
//                     className="w-20 h-15 rounded-lg object-cover" 
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium text-white truncate">{video.title}</h4>
//                     <p className="text-sm text-gray-400 mt-1">{video.channelTitle}</p>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-400">
//                     <Volume2 size={18} />
//                     <span className="text-sm">Play</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {searchResults.length === 0 && !currentVideo && (
//           <div className="text-center mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
//             <h3 className="text-xl font-semibold mb-4">How to use VoiceTunes</h3>
//             <div className="grid md:grid-cols-3 gap-6 text-gray-300">
//               <div>
//                 <div className="text-3xl mb-2">🎤</div>
//                 <p>Click the microphone and say "Play [song name]"</p>
//               </div>
//               <div>
//                 <div className="text-3xl mb-2">⌨️</div>
//                 <p>Or type your search query in the text box</p>
//               </div>
//               <div>
//                 <div className="text-3xl mb-2">🎵</div>
//                 <p>Click any result to start playing music</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VoiceTunes;
// VoiceTunes.js - Main Component
// Enhanced VoiceTunes.js - Main Component with new features
import React, { useState, useRef } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import SearchBar from './components/SearchBar';
import StatusIndicator from './components/StatusIndicator';
import VideoPlayer from './components/VideoPlayer';
import SearchResults from './components/SearchResults';
import WelcomeGuide from './components/WelcomeGuide';
import AudioVisualizer from './components/AudioVisualizer';
import Playlist from './components/Playlist';
import useWebSocket from './hooks/useWebSocket';
import useSpeechRecognition from './hooks/useSpeechRecognition';

const VoiceTunes = () => {
  const [transcription, setTranscription] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [playlist, setPlaylist] = useState([]);
  const [isRepeat, setIsRepeat] = useState(false);

  const playerRef = useRef(null);

  const { ws, isConnected, status, setStatus, sendMessage } = useWebSocket('ws://localhost:5000');

  const handleSpeechResult = (spokenText) => {
    setTranscription(spokenText);
    setStatus(`Heard: "${spokenText}" - Searching...`);
    sendMessage('text-search', { query: spokenText });
  };

  const { isRecording, startRecording, stopRecording } = useSpeechRecognition(
    handleSpeechResult,
    setStatus
  );

  if (ws && !ws.onmessage) {
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'processing':
        setStatus(data.message);
        break;
      case 'transcription':
        setTranscription(data.text);
        setStatus(`Heard: "${data.text}" - Searching...`);
        break;
      case 'search-results':
        setSearchResults(data.results);
        setStatus(`Found ${data.results.length} results`);
        break;
      case 'error':
        setStatus(`Error: ${data.message}`);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const handleTextSearch = () => {
    if (searchQuery.trim()) {
      sendMessage('text-search', { query: searchQuery });
      setStatus('Searching...');
    }
  };

  const playVideo = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    setStatus(`Now playing: ${video.title}`);
  };

  const togglePlayback = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        setStatus('Paused');
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setStatus('Playing');
      }
    }
  };

  const addToPlaylist = (video) => {
    if (!playlist.some(item => item.id === video.id)) {
      setPlaylist(prev => [...prev, video]);
      setStatus(`Added "${video.title}" to playlist`);
    }
  };

  const removeFromPlaylist = (index) => {
    const removedVideo = playlist[index];
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    setStatus(`Removed "${removedVideo.title}" from playlist`);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setStatus('Playlist cleared');
  };

  const shufflePlaylist = () => {
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    setStatus('Playlist shuffled');
  };

  const toggleRepeat = () => {
    setIsRepeat(prev => !prev);
    setStatus(isRepeat ? 'Repeat disabled' : 'Repeat enabled');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-sans">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
            🎵 VoiceTunes
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Voice-activated music discovery with visualizations
          </p>
        </header>

        {/* Status Indicator */}
        <StatusIndicator
          isConnected={isConnected}
          status={status}
          className="mb-8"
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left & Middle Column (span 2 on lg) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Voice Recorder Card */}
            <section className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 transition hover:shadow-indigo-500/50 duration-300">
              <VoiceRecorder
                isRecording={isRecording}
                isConnected={isConnected}
                transcription={transcription}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
              />
            </section>

            {/* Search Bar Card */}
            <section className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 transition hover:shadow-indigo-500/50 duration-300">
              <SearchBar
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearch={handleTextSearch}
                isConnected={isConnected}
              />
            </section>

            {/* Video Player Card */}
            <section className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 transition hover:shadow-indigo-500/50 duration-300">
              <VideoPlayer
                currentVideo={currentVideo}
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
                onPlayerStateChange={() => {}}
                ref={playerRef}
              />
            </section>

            {/* Audio Visualizer Card */}
            <section className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 transition hover:shadow-indigo-500/50 duration-300">
              <AudioVisualizer
                isPlaying={isPlaying}
                audioSource={currentVideo}
              />
            </section>

            {/* Search Results Card */}
            <section className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 transition hover:shadow-indigo-500/50 duration-300">
              <SearchResults
                searchResults={searchResults}
                onPlayVideo={playVideo}
                onAddToPlaylist={addToPlaylist}
                playlist={playlist}
              />
            </section>

            {/* Welcome Guide Card */}
            <section className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 transition hover:shadow-indigo-500/50 duration-300">
              <WelcomeGuide
                searchResults={searchResults}
                currentVideo={currentVideo}
              />
            </section>
          </div>

          {/* Right Column - Playlist */}
          <aside className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto transition hover:shadow-indigo-500/50 duration-300">
            <Playlist
              playlist={playlist}
              currentVideo={currentVideo}
              isPlaying={isPlaying}
              onAddToPlaylist={addToPlaylist}
              onRemoveFromPlaylist={removeFromPlaylist}
              onPlayFromPlaylist={playVideo}
              onClearPlaylist={clearPlaylist}
              onShufflePlaylist={shufflePlaylist}
              onToggleRepeat={toggleRepeat}
              isRepeat={isRepeat}
            />
          </aside>
        </div>  
      </div>
    </div>
  );
};

export default VoiceTunes;