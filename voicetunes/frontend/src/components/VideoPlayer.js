// components/VideoPlayer.js
import React from 'react';
import { Play, Pause } from 'lucide-react';
import YouTubePlayer from './YoutubePlayer';

const VideoPlayer = ({ 
  currentVideo, 
  isPlaying, 
  onTogglePlayback,
  onPlayerStateChange 
}) => {
  if (!currentVideo) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20" data-testid="video-player">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">🎵 Now Playing</h3>
        <button
          onClick={onTogglePlayback}
          className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all transform hover:scale-110"
          data-testid="playback-toggle"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>
      <div className="rounded-xl overflow-hidden">
        <YouTubePlayer videoId={currentVideo.id} onPlayerStateChange={onPlayerStateChange} />
      </div>
      <div className="mt-4 p-4 bg-white/10 rounded-xl">
        <p className="font-medium text-lg">{currentVideo.title}</p>
        <p className="text-gray-400 mt-1">{currentVideo.channelTitle}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;