'use client';

import { useState, useEffect } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // ⏪ Cargar mensajes guardados
  useEffect(() => {
    const storedMessages = localStorage.getItem('mybro_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // 💾 Guardar mensajes en localStorage
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
    <div className="h-screen w-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* 🔝 Header fijo */}
      <header className="bg-white shadow-md text-center text-xl font-semibold py-3 sticky top-0 z-10">
        MyBroApp
      </header>

      {/* 💬 Área de mensajes con scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2 whitespace-pre-wrap">
            {msg}
          </div>
        ))}
      </div>

      {/* ✍🏻 Input + Botones */}
      <div className="p-2 border-t bg-white">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí..."
            className="flex-1 px-4 py-2 border rounded text-base"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            ➤
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
