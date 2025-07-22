'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('mybro_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mybro_messages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, `🧍: ${userMessage}`]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, `🤖: ${data.reply}`]);
    } catch (error) {
      setMessages((prev) => [...prev, '❌ Error en la respuesta']);
    }
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header fijo tipo app */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 50,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>MyBroApp</h2>
      </div>

      {/* Contenido debajo del header */}
      <div style={{ paddingTop: 50, flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Área de mensajes con scroll propio */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: '#fff'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 12 }}>{msg}</div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input + botones */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #eee',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Escribe aquí..."
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 16,
            }}
          />
          <button onClick={handleSend} style={{ padding: '10px 16px' }}>➡️</button>
          <button
            onClick={() => {
              localStorage.removeItem('mybro_messages');
              setMessages([]);
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: '#eee',
              border: '1px solid #ccc',
            }}
          >
            Borrar
          </button>
          <a
            href="https://ko-fi.com/mybroapp"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 16px',
              backgroundColor: '#f9c846',
              color: '#000',
              textDecoration: 'none',
              borderRadius: 6,
              fontWeight: 'bold',
              border: '1px solid #d4a73c',
            }}
          >
            ☕ Donar
          </a>
        </div>
      </div>
    </div>
  );
}
