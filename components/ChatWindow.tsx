'use client';

import { useState, useEffect } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const storedMessages = localStorage.getItem('mybro_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleClear = () => {
    localStorage.removeItem('mybro_messages');
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      <header className="bg-white shadow text-center py-3 text-lg font-bold sticky top-0 z-10">
        MyBroApp
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 whitespace-pre-wrap">
            {msg}
          </div>
        ))}
      </div>

      <div className="p-2 bg-white border-t">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="w-1/2 py-2 bg-gray-300 rounded hover:bg-gray-400 text-center"
          >
            Borrar
          </button>
          <a
            href="https://ko-fi.com/your_kofi_username"
            target="_blank"
            rel="noopener noreferrer"
            className="w-1/2 py-2 bg-yellow-400 rounded hover:bg-yellow-500 text-center font-semibold"
          >
            ☕ Donar
          </a>
        </div>
      </div>
    </div>
  );
}
