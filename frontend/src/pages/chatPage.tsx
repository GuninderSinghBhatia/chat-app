import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function ChatPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`✅ Connected, joining room ${roomId}`);
      ws.send(JSON.stringify({ type: "joinRoom", token: Number(roomId) }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          token: Number(roomId), // Make sure this is a number!
          message: input
        })
      );
      setInput("");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">ChatApp</h1>
        <p className="app-subtitle">Room: {roomId}</p>
      </header>

      <div className="message-box">
        {messages.map((message, index) => (
          <div key={`msg-${index}`} className="message">
            <span>{message}</span>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="input-field"
        />
        <button onClick={sendMessage} className="send-button">
          Send Message
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
