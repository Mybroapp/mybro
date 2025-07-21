'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Error en la respuesta' }]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">MyBroApp 💬</h2>
      <div className="h-80 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
              msg.sender === 'user'
                ? 'bg-blue-100 text-blue-800 self-end ml-auto'
                : 'bg-purple-100 text-purple-800 self-start mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={handleSend}
          className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
