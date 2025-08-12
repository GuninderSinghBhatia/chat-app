// App.tsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LobbyPage } from './pages/lobbyPage';
import ChatPage from './pages/chatPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LobbyWithSocket />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

function LobbyWithSocket() {
  const navigate = useNavigate();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create socket once
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.addEventListener('open', () => {
      console.log('✅ Connected to server');
    });

    socketRef.current.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'roomCreated' || data.type === 'roomJoined') {
        console.log(`Navigating to room: ${data.roomId}`);
        navigate(`/chat/${data.roomId}`); // Navigate to chat
      } else if (data.type === 'error') {
        alert(`Error: ${data.message}`);
      }
    });

    return () => {
      socketRef.current?.close();
    };
  }, [navigate]);

  function handleCreateRoom(token: number | null) {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'createRoom', token }));
    } else {
      console.error('❌ Socket not connected');
    }
  }

  function handleJoinRoom(roomCode: string) {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'joinRoom', token: Number(roomCode) }));
    } else {
      console.error('❌ Socket not connected');
    }
  }

  return <LobbyPage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
}
