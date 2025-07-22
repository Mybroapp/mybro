'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header fijo */}
      <div
        style={{
          position: 'sticky',
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
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>MyBroApp</h2>
      </div>

      {/* Área de mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: '#fff',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + botones */}
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={scrollToBottom}
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
        <button onClick={handleSend} style={{ padding: '10px 16px' }}>Enviar</button>
      </div>
    </div>
  );
}
