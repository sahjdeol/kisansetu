
"use client";

import { useEffect, useState } from "react";

const initialOffers = [
  {
    id: 1,
    farmer: "Gurpreet Singh",
    location: "Amritsar",
    offering: "50 kg Wheat",
    wants: "Vegetable Seeds",
    emoji: "🌾",
  },
  {
    id: 2,
    farmer: "Harjit Kaur",
    location: "Ludhiana",
    offering: "Organic Tomatoes",
    wants: "Wheat",
    emoji: "🍅",
  },
  {
    id: 3,
    farmer: "Manpreet Singh",
    location: "Patiala",
    offering: "Tractor Services",
    wants: "Fertilizer",
    emoji: "🚜",
  },
  {
    id: 4,
    farmer: "Simran Kaur",
    location: "Jalandhar",
    offering: "Potatoes",
    wants: "Drip Irrigation Pipes",
    emoji: "🥔",
  },
];

export default function BarterPage() {
  
    const [offers, setOffers] = useState(initialOffers);

  // KISAN_PERSISTENCE
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kisan-barter");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setOffers(parsed);
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
        "kisan-barter",
        JSON.stringify(offers)
      );
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }, [offers, storageReady]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    farmer: "",
    location: "",
    offering: "",
    wants: "",
  });

  const filteredOffers = offers.filter((offer) =>
    `${offer.farmer} ${offer.location} ${offer.offering} ${offer.wants}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addOffer(e) {
    e.preventDefault();

    setOffers((previous) => [
      {
        ...form,
        id: Date.now(),
        emoji: "🌱",
      },
      ...previous,
    ]);

    setForm({
      farmer: "",
      location: "",
      offering: "",
      wants: "",
    });

    setShowForm(false);
  }

  function requestExchange(id) {
    setRequests((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">
              🔄 Farmer Barter Exchange
            </h1>

            <p className="text-gray-600 mt-2">
              Exchange crops, seeds and equipment without cash.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 text-white px-5 py-3 rounded-lg"
          >
            {showForm ? "Close Form" : "+ Create Barter Offer"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={addOffer}
            className="bg-white rounded-xl p-6 shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <h2 className="text-xl font-bold text-green-900 md:col-span-2">
              Create an Exchange Offer
            </h2>

            {[
              ["farmer", "Your Name"],
              ["location", "Your Location"],
              ["offering", "What are you offering?"],
              ["wants", "What do you want in exchange?"],
            ].map(([field, placeholder]) => (
              <input
                key={field}
                required
                placeholder={placeholder}
                value={form[field]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [field]: e.target.value,
                  })
                }
                className="border rounded-lg p-3 text-gray-900"
              />
            ))}

            <button
              type="submit"
              className="md:col-span-2 bg-green-700 text-white p-3 rounded-lg"
            >
              Publish Barter Offer
            </button>
          </form>
        )}

        <input
          type="text"
          placeholder="Search items, locations, or farmers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border rounded-lg p-3 mb-8 text-gray-900"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const requested = requests.includes(offer.id);

            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="bg-green-100 text-center py-8 text-5xl">
                  {offer.emoji}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-green-900">
                    {offer.farmer}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    📍 {offer.location}
                  </p>

                  <div className="mt-5 bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Offering
                    </p>
                    <p className="font-bold text-green-800">
                      {offer.offering}
                    </p>
                  </div>

                  <div className="text-center text-2xl my-3">
                    ⇅
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">
                      Wants in Exchange
                    </p>
                    <p className="font-bold text-amber-800">
                      {offer.wants}
                    </p>
                  </div>

                  <button
                    onClick={() => requestExchange(offer.id)}
                    disabled={requested}
                    className={`w-full mt-5 py-3 rounded-lg font-medium ${
                      requested
                        ? "bg-gray-200 text-gray-600"
                        : "bg-green-700 text-white hover:bg-green-800"
                    }`}
                  >
                    {requested
                      ? "Request Marked (Demo)"
                      : "Request Exchange"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOffers.length === 0 && (
          <p className="text-center text-gray-600">
            No matching exchange offers found.
          </p>
        )}

        <p className="text-center text-gray-500 text-sm mt-10">
          Demo only: offers and exchange requests are kept
          temporarily in this browser session.
        </p>
      </div>
    </main>
  );
}
