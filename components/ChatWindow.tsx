'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔁 Al iniciar, cargar mensajes desde localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('mybro_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // 💾 Guardar mensajes cuando cambian
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header fijo */}
      <div style={{ padding: 10, backgroundColor: '#f9f9f9', textAlign: 'center', borderBottom: '1px solid #ccc' }}>
        <h2 style={{ margin: 0 }}>MyBroApp</h2>
      </div>

      {/* Chat principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 10 }}>
        <div
          style={{
            flex: 1,
            border: '1px solid #ccc',
            padding: 10,
            overflowY: 'auto',
            backgroundColor: '#fff',
          }}
        >
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 8 }}>{msg}</div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: 'flex', marginTop: 10, gap: 8, flexWrap: 'wrap' }}>
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
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: 16, // ✅ evita zoom en móviles
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
              borderRadius: 4,
              fontWeight: 'bold',
              border: '1px solid #d4a73c',
              textAlign: 'center',
            }}
          >
            ☕ Donar
          </a>
        </div>
      </div>
    </div>
  );
}
