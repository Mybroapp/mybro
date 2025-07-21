'use client';

import { useState } from 'react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

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
    <div className="p-4 max-w-2xl mx-auto">
      {/* Verificación de Tailwind */}
      <div className="bg-red-500 text-white p-4 rounded mb-4 text-center">
        Tailwind está funcionando
      </div>

      <h2 className="text-2xl font-bold mb-2">MyBroApp</h2>

      <div className="border border-gray-300 rounded p-3 h-72 overflow-y-auto bg-white shadow">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">{msg}</div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe aquí..."
          className="flex-grow p-2 border rounded"
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
