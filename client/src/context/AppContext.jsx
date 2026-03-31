import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveBuses, setLiveBuses] = useState([]);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Socket.io connection
  useEffect(() => {
    const socket = io(BACKEND, { transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      console.log('🟢 Connected to BusNear server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from server');
      setConnected(false);
    });

    socket.on('allBuses', (buses) => {
      setLiveBuses(buses);
    });

    socket.on('busUpdate', (data) => {
      setLiveBuses(prev => {
        const idx = prev.findIndex(b => b.routeId === data.routeId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    socket.on('sosReceived', (data) => {
      addNotification(`🚨 SOS from ${data.passengerName}`, 'sos');
    });

    return () => socket.disconnect();
  }, []);

  const isLoggedIn = !!user;

  const addNotification = (msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    user,
    setUser,
    selectedRoute,
    setSelectedRoute,
    sosActive,
    setSosActive,
    searchQuery,
    setSearchQuery,
    liveBuses,
    setLiveBuses,
    connected,
    isLoggedIn,
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
