// components/Playlist.js
import React, { useState } from 'react';
import { Plus, X, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react';

const Playlist = ({
  playlist,
  currentVideo,
  isPlaying,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  onPlayFromPlaylist,
  onClearPlaylist,
  onShufflePlaylist,
  onToggleRepeat,
  isRepeat = false
}) => {
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [isEditing, setIsEditing] = useState(false);

  const getCurrentIndex = () => {
    if (!currentVideo) return -1;
    return playlist.findIndex(video => video.id === currentVideo.id);
  };

  const playNext = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < playlist.length - 1) {
      onPlayFromPlaylist(playlist[currentIndex + 1]);
    } else if (isRepeat && playlist.length > 0) {
      onPlayFromPlaylist(playlist[0]);
    }
  };

  const playPrevious = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      onPlayFromPlaylist(playlist[currentIndex - 1]);
    } else if (isRepeat && playlist.length > 0) {
      onPlayFromPlaylist(playlist[playlist.length - 1]);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      {/* Playlist Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="bg-white/20 px-3 py-1 rounded-lg text-white focus:outline-none focus:bg-white/30"
              autoFocus
            />
          ) : (
            <h3 
              className="text-xl font-semibold cursor-pointer hover:text-purple-300"
              onClick={() => setIsEditing(true)}
            >
              🎵 {playlistName}
            </h3>
          )}
          <span className="text-sm text-gray-400">({playlist.length} tracks)</span>
        </div>
        
        {playlist.length > 0 && (
          <button
            onClick={onClearPlaylist}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Clear playlist"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Playback Controls */}
      {playlist.length > 0 && (
        <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-white/10 rounded-xl">
          <button
            onClick={playPrevious}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
            disabled={!currentVideo}
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={() => currentVideo && onPlayFromPlaylist(currentVideo)}
            className="p-3 bg-purple-500 hover:bg-purple-600 rounded-full transition-all"
            disabled={!currentVideo}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={playNext}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
            disabled={!currentVideo}
          >
            <SkipForward size={20} />
          </button>
          
          <button
            onClick={onShufflePlaylist}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
            title="Shuffle playlist"
          >
            <Shuffle size={20} />
          </button>
          
          <button
            onClick={onToggleRepeat}
            className={`p-2 rounded-full transition-all ${
              isRepeat ? 'bg-purple-500 text-white' : 'hover:bg-white/20'
            }`}
            title="Toggle repeat"
          >
            <Repeat size={20} />
          </button>
        </div>
      )}

      {/* Playlist Items */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {playlist.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Plus size={48} className="mx-auto mb-4 opacity-50" />
            <p>Your playlist is empty</p>
            <p className="text-sm">Add songs from search results</p>
          </div>
        ) : (
          playlist.map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                currentVideo?.id === video.id
                  ? 'bg-purple-500/30 border border-purple-400'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              onClick={() => onPlayFromPlaylist(video)}
            >
              <div className="flex-shrink-0 w-8 text-center">
                {currentVideo?.id === video.id && isPlaying ? (
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-purple-400 animate-pulse"></div>
                      <div className="w-1 h-4 bg-purple-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-4 bg-purple-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">{index + 1}</span>
                )}
              </div>
              
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-10 h-8 rounded object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{video.title}</p>
                <p className="text-sm text-gray-400 truncate">{video.channelTitle}</p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromPlaylist(index);
                }}
                className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-all"
                title="Remove from playlist"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Playlist Stats */}
      {playlist.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 text-sm text-gray-400 text-center">
          Total duration: ~{formatDuration(playlist.length * 210)} {/* Assuming average 3.5 min per song */}
        </div>
      )}
    </div>
  );
};

export default Playlist;