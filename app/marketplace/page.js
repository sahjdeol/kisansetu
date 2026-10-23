
"use client";

import { useEffect, useState } from "react";

const initialProducts = [
  {
    id: 1,
    name: "Fresh Wheat",
    farmer: "Gurpreet Singh",
    location: "Amritsar",
    price: 2600,
    unit: "quintal",
    category: "Grains",
    emoji: "🌾",
  },
  {
    id: 2,
    name: "Organic Tomatoes",
    farmer: "Harjit Kaur",
    location: "Ludhiana",
    price: 35,
    unit: "kg",
    category: "Vegetables",
    emoji: "🍅",
  },
  {
    id: 3,
    name: "Fresh Potatoes",
    farmer: "Manpreet Singh",
    location: "Jalandhar",
    price: 25,
    unit: "kg",
    category: "Vegetables",
    emoji: "🥔",
  },
  {
    id: 4,
    name: "Basmati Rice",
    farmer: "Sukhdev Singh",
    location: "Patiala",
    price: 85,
    unit: "kg",
    category: "Grains",
    emoji: "🍚",
  },
  {
    id: 5,
    name: "Fresh Apples",
    farmer: "Ramesh Kumar",
    location: "Hoshiarpur",
    price: 120,
    unit: "kg",
    category: "Fruits",
    emoji: "🍎",
  },
  {
    id: 6,
    name: "Organic Carrots",
    farmer: "Simran Kaur",
    location: "Bathinda",
    price: 40,
    unit: "kg",
    category: "Vegetables",
    emoji: "🥕",
  },
];

const categories = [
  "All",
  "Grains",
  "Vegetables",
  "Fruits",
  "Other",
];

export default function MarketplacePage() {
  
    const [products, setProducts] = useState(initialProducts);

  // KISAN_PERSISTENCE
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kisan-marketplace");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setProducts(parsed);
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
        "kisan-marketplace",
        JSON.stringify(products)
      );
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }, [products, storageReady]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    farmer: "",
    location: "",
    price: "",
    unit: "kg",
    category: "Vegetables",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      `${product.name} ${product.location} ${product.farmer}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  function addProduct(e) {
    e.preventDefault();

    const newProduct = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      emoji: "🌱",
    };

    setProducts((prev) => [newProduct, ...prev]);

    setForm({
      name: "",
      farmer: "",
      location: "",
      price: "",
      unit: "kg",
      category: "Vegetables",
    });

    setShowForm(false);
  }

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">
              🛒 Farmers Marketplace
            </h1>
            <p className="text-gray-600 mt-2">
              Connecting farmers directly with buyers.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
          >
            {showForm ? "Close Form" : "+ Sell Your Produce"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={addProduct}
            className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <h2 className="text-xl font-bold text-green-900 md:col-span-2">
              Add Your Produce
            </h2>

            {["name", "farmer", "location", "price"].map((field) => (
              <input
                key={field}
                type={field === "price" ? "number" : "text"}
                min={field === "price" ? "1" : undefined}
                step={field === "price" ? "any" : undefined}
                required
                placeholder={
                  field.charAt(0).toUpperCase() + field.slice(1)
                }
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
              <option value="kg">kg</option>
              <option value="quintal">quintal</option>
              <option value="ton">ton</option>
            </select>

            <button
              type="submit"
              className="bg-green-700 text-white rounded-lg p-3 md:col-span-2"
            >
              Publish Listing
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search crops, farmers, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg flex-1 min-w-56 bg-white text-gray-900"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg bg-white text-gray-900"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div className="bg-green-100 text-6xl text-center py-10">
                {product.emoji}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-green-900">
                  {product.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  👨‍🌾 {product.farmer}
                </p>

                <p className="text-gray-600">
                  📍 {product.location}
                </p>

                <p className="text-2xl font-bold text-green-700 my-4">
                  ₹{product.price}/{product.unit}
                </p>

                <button
                  onClick={() =>
                    alert(
                      `Interest recorded for ${product.name} (demo only).`
                    )
                  }
                  className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800"
                >
                  Contact Farmer
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-12">
            No products found. Try another search.
          </p>
        )}

        <p className="text-center text-gray-500 text-sm mt-10">
          Demo listings only. New products are stored temporarily
          in this browser session.
        </p>
      </div>
    </main>
  );
}
