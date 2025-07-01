// hooks/useSpeechRecognition.js
import { useState, useRef } from 'react';

const useSpeechRecognition = (onResult, onStatusChange) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onStatusChange('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
      onStatusChange('Listening... Speak now!');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onStatusChange(`Error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      onResult(spokenText);
    };

    recognition.onend = () => {
      setIsRecording(false);
      onStatusChange('Stopped listening.');
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};

export default useSpeechRecognition;
