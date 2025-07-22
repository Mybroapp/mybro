'use client';

import { useState, useEffect } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // 🔁 Al iniciar, cargar mensajes desde localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('mybro_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // 💾 Cada vez que cambian los mensajes, guardarlos en localStorage
  useEffect(() => {
    localStorage.setItem('mybro_messages', JSON.stringify(messages));
  }, [messages]);

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
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>MyBroApp</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>{msg}</div>
        ))}
      </div>
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
        style={{ width: '80%', padding: 8, marginTop: 10 }}
      />
      <div style={{ marginTop: 10 }}>
        <button onClick={handleSend} style={{ padding: 8, marginRight: 10 }}>Enviar</button>
        <button
          onClick={() => {
            localStorage.removeItem('mybro_messages');
            setMessages([]);
          }}
          style={{
            padding: 8,
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            color: '#333',
            marginRight: 10,
          }}
        >
          Borrar chat
        </button>
        <a
          href="https://ko-fi.com/mybroapp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: 8,
            backgroundColor: '#f9c846',
            color: '#000',
            textDecoration: 'none',
            borderRadius: 4,
            fontWeight: 'bold',
            border: '1px solid #d4a73c',
          }}
        >
          ☕ Invítame un café
        </a>
      </div>
    </div>
  );
}
