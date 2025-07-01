// components/YouTubePlayer.js
import React, { useRef, useEffect } from 'react';

const YouTubePlayer = React.memo(({ videoId, onPlayerStateChange }) => {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let player;
    
    const cleanupPlayer = () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log('Player already destroyed');
        }
        playerRef.current = null;
      }
      
      if (playerContainerRef.current) {
        while (playerContainerRef.current.firstChild) {
          playerContainerRef.current.removeChild(playerContainerRef.current.firstChild);
        }
      }
    };

    function createPlayer() {
      cleanupPlayer();
      
      if (window.YT && window.YT.Player && playerContainerRef.current) {
        player = new window.YT.Player(playerContainerRef.current, {
          height: '300',
          width: '100%',
          videoId,
          events: {
            onReady: (event) => {
              playerRef.current = event.target;
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (onPlayerStateChange) {
                onPlayerStateChange(event.data);
              }
            }
          }
        });
      }
    }

    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      cleanupPlayer();
      if (window.onYouTubeIframeAPIReady === createPlayer) {
        window.onYouTubeIframeAPIReady = null;
      }
    };
  }, [videoId, onPlayerStateChange]);

  return <div ref={playerContainerRef} className="w-full" data-testid="youtube-player"></div>;
});

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;