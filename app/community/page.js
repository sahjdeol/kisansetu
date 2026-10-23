"use client";

import { useEffect, useState } from "react";

export default function CommunityPage() {
  
    const [posts, setPosts] = useState([
    "How can I improve wheat production?",
    "What is the best irrigation method?"
  ]);

  // KISAN_PERSISTENCE
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kisan-community");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setPosts(parsed);
      }
    } catch (error) {
      console.error("Storage read error:", error);
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem(
        "kisan-community",
        JSON.stringify(posts)
      );
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }, [posts, storageReady]);

  const [message, setMessage] = useState("");

  function addPost(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setPosts([message.trim(), ...posts]);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        👥 Farmer Community
      </h1>
      <form onSubmit={addPost} className="flex flex-wrap gap-3 mb-8">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a farming question..."
          className="flex-1 border rounded-lg p-3 bg-white text-gray-900"
        />
        <button className="bg-green-700 text-white px-6 py-3 rounded-lg">
          Post
        </button>
      </form>
      {posts.map((post, index) => (
        <div key={index} className="bg-white rounded-xl p-5 mb-4 shadow text-gray-800">
          💬 {post}
        </div>
      ))}
      <p className="text-sm text-gray-500">
        Demo: posts disappear when the page reloads.
      </p>
    </main>
  );
}
