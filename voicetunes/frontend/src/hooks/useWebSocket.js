// hooks/useWebSocket.js
import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Ready to listen...');
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = () => {
    try {
      const websocket = new WebSocket(url);

      websocket.onopen = () => {
        setIsConnected(true);
        setStatus('Connected! Ready to listen...');
        setWs(websocket);
      };

      websocket.onclose = () => {
        setIsConnected(false);
        setStatus('Disconnected - Attempting to reconnect...');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = (error) => {
        setStatus('Connection error');
        console.error('WebSocket error:', error);
      };

      return websocket;
    } catch (error) {
      setStatus('Failed to connect');
      console.error('WebSocket connection error:', error);
      return null;
    }
  };

  const sendMessage = (type, payload) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, ...payload }));
      return true;
    } else {
      setStatus('Not connected to server');
      return false;
    }
  };

  useEffect(() => {
    const websocket = connectWebSocket();
    
    return () => {
      if (websocket) websocket.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [url]);

  return {
    ws,
    isConnected,
    status,
    setStatus,
    sendMessage
  };
};

export default useWebSocket;
