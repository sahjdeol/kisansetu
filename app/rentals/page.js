
"use client";

import { useEffect, useState } from "react";

const initialRentals = [
  {
    id: 1,
    name: "Mahindra 575 Tractor",
    owner: "Sukhdev Singh",
    location: "Ludhiana",
    price: 1200,
    unit: "day",
    category: "Tractor",
    emoji: "🚜",
  },
  {
    id: 2,
    name: "Combine Harvester",
    owner: "Manjit Kaur",
    location: "Patiala",
    price: 3500,
    unit: "day",
    category: "Machinery",
    emoji: "🌾",
  },
  {
    id: 3,
    name: "5-Acre Fertile Plot",
    owner: "Harjit Kaur",
    location: "Tarn Taran",
    price: 25000,
    unit: "season",
    category: "Land",
    emoji: "🏞️",
  },
  {
    id: 4,
    name: "Rotavator",
    owner: "Gurpreet Singh",
    location: "Amritsar",
    price: 600,
    unit: "day",
    category: "Machinery",
    emoji: "⚙️",
  },
  {
    id: 5,
    name: "3-Acre Irrigated Plot",
    owner: "Ramesh Kumar",
    location: "Jalandhar",
    price: 18000,
    unit: "season",
    category: "Land",
    emoji: "🌱",
  },
];

const categories = ["All", "Tractor", "Machinery", "Land"];

export default function RentalsPage() {
  
    const [rentals, setRentals] = useState(initialRentals);

  // KISAN_PERSISTENCE
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kisan-rentals");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRentals(parsed);
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
        "kisan-rentals",
        JSON.stringify(rentals)
      );
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }, [rentals, storageReady]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [requested, setRequested] = useState([]);

  const [form, setForm] = useState({
    name: "",
    owner: "",
    location: "",
    price: "",
    unit: "day",
    category: "Tractor",
  });

  const filtered = rentals.filter((item) => {
    const matchesSearch =
      `${item.name} ${item.owner} ${item.location}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return (
      matchesSearch &&
      (category === "All" || item.category === category)
    );
  });

  function addRental(e) {
    e.preventDefault();

    setRentals((previous) => [
      {
        ...form,
        id: Date.now(),
        price: Number(form.price),
        emoji:
          form.category === "Tractor"
            ? "🚜"
            : form.category === "Land"
            ? "🏞️"
            : "⚙️",
      },
      ...previous,
    ]);

    setForm({
      name: "",
      owner: "",
      location: "",
      price: "",
      unit: "day",
      category: "Tractor",
    });

    setShowForm(false);
  }

  function requestRental(id) {
    setRequested((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">
              🚜 Farm Equipment & Land Rentals
            </h1>
            <p className="text-gray-600 mt-2">
              Rent equipment and farmland at affordable rates.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 text-white px-5 py-3 rounded-lg"
          >
            {showForm ? "Close Form" : "+ List for Rent"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={addRental}
            className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <h2 className="md:col-span-2 text-xl font-bold text-green-900">
              List Your Equipment or Land
            </h2>

            {[
              ["name", "Equipment or Land Name"],
              ["owner", "Owner Name"],
              ["location", "Location"],
              ["price", "Rental Price (₹)"],
            ].map(([field, placeholder]) => (
              <input
                key={field}
                required
                type={field === "price" ? "number" : "text"}
                min={field === "price" ? "1" : undefined}
                step={field === "price" ? "any" : undefined}
                placeholder={placeholder}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="border rounded-lg p-3 text-gray-900"
              />
            ))}

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="border rounded-lg p-3 text-gray-900"
            >
              {categories.slice(1).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={form.unit}
              onChange={(e) =>
                setForm({ ...form, unit: e.target.value })
              }
              className="border rounded-lg p-3 text-gray-900"
            >
              <option value="day">Per Day</option>
              <option value="hour">Per Hour</option>
              <option value="season">Per Season</option>
            </select>

            <button
              type="submit"
              className="md:col-span-2 bg-green-700 text-white p-3 rounded-lg"
            >
              Publish Rental Listing
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment, land or location..."
            className="border bg-white p-3 rounded-lg flex-1 min-w-56 text-gray-900"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border bg-white p-3 rounded-lg text-gray-900"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isRequested = requested.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="bg-green-100 text-center py-10 text-6xl">
                  {item.emoji}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-green-900">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    👨‍🌾 {item.owner}
                  </p>

                  <p className="text-gray-600">
                    📍 {item.location}
                  </p>

                  <p className="text-2xl font-bold text-green-700 mt-4">
                    ₹{item.price.toLocaleString("en-IN")}/{item.unit}
                  </p>

                  <button
                    onClick={() => requestRental(item.id)}
                    disabled={isRequested}
                    className={`w-full mt-5 py-3 rounded-lg font-medium ${
                      isRequested
                        ? "bg-gray-200 text-gray-600"
                        : "bg-green-700 text-white hover:bg-green-800"
                    }`}
                  >
                    {isRequested
                      ? "Request Marked (Demo)"
                      : "Request Rental"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No matching rental listings found.
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-10">
          Demo only: listings and rental requests are stored
          temporarily in this browser session.
        </p>
      </div>
    </main>
  );
}
