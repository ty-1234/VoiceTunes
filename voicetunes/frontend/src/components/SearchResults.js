// components/SearchResults.js - Enhanced with playlist functionality
import React from 'react';
import { Volume2, Plus } from 'lucide-react';

const SearchResults = ({ searchResults, onPlayVideo, onAddToPlaylist, playlist = [] }) => {
  if (searchResults.length === 0) return null;

  const isInPlaylist = (videoId) => {
    return playlist.some(video => video.id === videoId);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20" data-testid="search-results">
      <h3 className="text-xl font-semibold mb-6">🔍 Search Results</h3>
      <div className="grid gap-4">
        {searchResults.map((video) => (
          <div 
            key={video.id} 
            className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10"
            data-testid={`search-result-${video.id}`}
          >
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-20 h-15 rounded-lg object-cover cursor-pointer" 
              onClick={() => onPlayVideo(video)}
            />
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPlayVideo(video)}>
              <h4 className="font-medium text-white truncate">{video.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{video.channelTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddToPlaylist(video)}
                disabled={isInPlaylist(video.id)}
                className={`p-2 rounded-full transition-all ${
                  isInPlaylist(video.id)
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : 'bg-white/20 hover:bg-white/30 text-gray-400'
                }`}
                title={isInPlaylist(video.id) ? 'Already in playlist' : 'Add to playlist'}
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => onPlayVideo(video)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Volume2 size={18} />
                <span className="text-sm">Play</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;