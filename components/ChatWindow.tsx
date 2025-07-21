import React from "react";
import ChatBox from "./ChatBox.tsx";

const ChatWindow = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        <header className="bg-indigo-500 text-white p-4 text-center rounded-t-2xl shadow">
          <h1 className="text-2xl font-bold">MyBroApp 💬</h1>
          <p className="text-sm">Tu compañero emocional, siempre aquí.</p>
        </header>
        <main className="p-4">
          <ChatBox />
        </main>
      </div>
    </div>
  );
};

export default ChatWindow;
