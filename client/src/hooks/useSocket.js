import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on('connect', () => {
      setConnected(true);
      console.log('Connected to socket server');
    });

    s.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from socket server');
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const emit = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  return { socket, connected, emit };
};
