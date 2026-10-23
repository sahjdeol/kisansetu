"use client";

import { useState } from "react";

const crops = [
  { name: "Wheat", season: "Rabi", soil: "Loamy" },
  { name: "Mustard", season: "Rabi", soil: "Sandy Loam" },
  { name: "Paddy", season: "Kharif", soil: "Clay" },
  { name: "Maize", season: "Kharif", soil: "Loamy" },
  { name: "Moong", season: "Zaid", soil: "Sandy Loam" },
];

export default function CropAdvisorPage() {
  const [season, setSeason] = useState("Rabi");
  const [soil, setSoil] = useState("Loamy");

  const suggestions = crops.filter(
    (crop) => crop.season === season && crop.soil === soil
  );

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <h1 className="text-3xl font-bold text-green-900 mb-3">
        🌱 Smart Crop Advisor
      </h1>
      <p className="text-gray-600 mb-6">
        Choose your season and soil to find suitable crops.
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <select value={season} onChange={(e) => setSeason(e.target.value)}
          className="border rounded-lg p-3 bg-white text-gray-900">
          <option>Rabi</option>
          <option>Kharif</option>
          <option>Zaid</option>
        </select>

        <select value={soil} onChange={(e) => setSoil(e.target.value)}
          className="border rounded-lg p-3 bg-white text-gray-900">
          <option>Loamy</option>
          <option>Sandy Loam</option>
          <option>Clay</option>
        </select>
      </div>

      {suggestions.map((crop) => (
        <div key={crop.name} className="bg-white rounded-xl p-6 shadow mb-4">
          <h2 className="text-xl font-bold text-green-800">
            🌿 {crop.name}
          </h2>
          <p className="text-gray-600">{crop.season} • {crop.soil}</p>
        </div>
      ))}

      {suggestions.length === 0 && (
        <p className="text-gray-600">No matching crops in this demo dataset.</p>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Rule-based demo, not an AI model. Confirm crop suitability locally.
      </p>
    </main>
  );
}
