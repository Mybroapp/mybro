'use client';
import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, `🧍‍♂️: ${userMessage}`]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userMessage }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setMessages((prev) => [...prev, `🤖: ${data.reply}`]);
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu mensaje..."
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={handleSend} style={{ padding: '0.5rem' }}>Enviar</button>
    </div>
  );
}
