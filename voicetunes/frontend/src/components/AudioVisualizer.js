import React, { useRef, useEffect, useState, useCallback } from 'react';

const AudioVisualizer = ({ isPlaying, audioSource }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const [visualizerType, setVisualizerType] = useState('bars');

  const setupAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
      }

      createDemoAudio();
      startVisualization();
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (isPlaying && audioSource) {
      setupAudioContext();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
    };
  }, [isPlaying, audioSource, setupAudioContext]);

  const createDemoAudio = () => {
    const audioContext = audioContextRef.current;
    const analyser = analyserRef.current;

    const oscillators = [];
    const frequencies = [220, 330, 440, 550];

    frequencies.forEach((freq) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1 / frequencies.length, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(analyser);

      oscillator.start();
      oscillators.push({ oscillator, gainNode });
    });

    audioContextRef.current.oscillators = oscillators;
  };

  const startVisualization = () => {
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      drawVisualization(dataArray);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (audioContextRef.current?.oscillators) {
      audioContextRef.current.oscillators.forEach(({ oscillator }) => {
        try {
          oscillator.stop();
        } catch (e) {}
      });
      audioContextRef.current.oscillators = [];
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const drawVisualization = (dataArray) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (visualizerType === 'bars') {
      drawBars(ctx, dataArray, width, height);
    } else if (visualizerType === 'circle') {
      drawCircle(ctx, dataArray, width, height);
    } else if (visualizerType === 'wave') {
      drawWave(ctx, dataArray, width, height);
    }
  };

  const drawBars = (ctx, dataArray, width, height) => {
    const barWidth = width / dataArray.length;

    dataArray.forEach((value, index) => {
      const barHeight = (value / 255) * height * 0.8;
      const x = index * barWidth;
      const y = height - barHeight;

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(0.5, '#A855F7');
      gradient.addColorStop(1, '#EC4899');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    });
  };

  const drawCircle = (ctx, dataArray, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    dataArray.forEach((value, index) => {
      const angle = (index / dataArray.length) * 2 * Math.PI;
      const barHeight = (value / 255) * radius;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const hue = (index / dataArray.length) * 360;
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  };

  const drawWave = (ctx, dataArray, width, height) => {
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const sliceWidth = width / dataArray.length;
    let x = 0;

    dataArray.forEach((value, index) => {
      const y = (value / 255) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    });

    ctx.stroke();
  };

  const VisualizerControls = () => (
    <div className="flex gap-2 mb-4">
      {['bars', 'circle', 'wave'].map((type) => (
        <button
          key={type}
          onClick={() => setVisualizerType(type)}
          className={`px-3 py-1 rounded-lg text-sm transition-all ${
            visualizerType === type
              ? 'bg-purple-500 text-white'
              : 'bg-white/20 text-gray-300 hover:bg-white/30'
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4">🎵 Audio Visualizer</h3>
      <VisualizerControls />
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-48 bg-black/20 rounded-lg"
          style={{ minHeight: '200px' }}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Start playing music to see visualization
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioVisualizer;
