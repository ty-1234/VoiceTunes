import React from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceRecorder = ({ 
  isRecording, 
  isConnected, 
  transcription, 
  onStartRecording, 
  onStopRecording 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
      <div className="text-center">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={!isConnected}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          data-testid="voice-recorder-button"
        >
          {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
        </button>
        <p className="mt-6 text-xl font-medium">
          {isRecording ? '🎤 Listening...' : '🎵 Click to speak your music request'}
        </p>
        {transcription && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg" data-testid="transcription-display">
            <p className="text-sm text-gray-300 mb-1">You said:</p>
            <p className="text-lg font-medium text-blue-300">"{transcription}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
