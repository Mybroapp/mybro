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
    setMessages((prev) => [...prev, `<strong>Yo</strong>: ${userMessage}`]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, `<strong>Bro</strong>: ${data.reply}`]);
    } catch (error) {
      setMessages((prev) => [...prev, '❌ Error en la respuesta']);
    }
  };

  const renderMessage = (msg: string, i: number) => {
    const isUser = msg.startsWith('<strong>Yo</strong>:');
    const isBro = msg.startsWith('<strong>Bro</strong>:');
    const alignment = isUser ? 'flex-end' : 'flex-start';
    const bgColor = isUser ? '#e0f2ff' : isBro ? '#f1f1f1' : '#fff';

    return (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: alignment,
        }}
      >
        <div
          style={{
            backgroundColor: bgColor,
            padding: '8px 12px',
            borderRadius: 8,
            marginBottom: 10,
            maxWidth: '80%',
            whiteSpace: 'pre-wrap',
          }}
          dangerouslySetInnerHTML={{ __html: msg }}
        />
      </div>
    );
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
        {messages.map((msg, i) => renderMessage(msg, i))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + botones */}
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid #eee',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={scrollToBottom}
          onClick={scrollToBottom}
          onKeyDown={(e) => {
            if (["Enter", "Return", "Go", "Send"].includes(e.key)) {
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
  );
}
