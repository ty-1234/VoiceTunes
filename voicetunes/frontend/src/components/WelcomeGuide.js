// components/WelcomeGuide.js
import React from 'react';

const WelcomeGuide = ({ searchResults, currentVideo }) => {
  if (searchResults.length > 0 || currentVideo) return null;

  return (
    <div className="text-center mt-12 p-8 bg-white/5 rounded-2xl border border-white/10" data-testid="welcome-guide">
      <h3 className="text-xl font-semibold mb-4">How to use VoiceTunes</h3>
      <div className="grid md:grid-cols-3 gap-6 text-gray-300">
        <div>
          <div className="text-3xl mb-2">🎤</div>
          <p>Click the microphone and say "Play [song name]"</p>
        </div>
        <div>
          <div className="text-3xl mb-2">⌨️</div>
          <p>Or type your search query in the text box</p>
        </div>
        <div>
          <div className="text-3xl mb-2">🎵</div>
          <p>Click any result to start playing music</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
