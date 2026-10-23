"use client";
import InteractionPanel from "@/components/InteractionPanel";


import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    farmer: "",
    location: "",
    price: "",
    unit: "kg",
    category: "Vegetables",
  });

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("marketplace")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Error loading products: " + error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function addProduct(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw new Error("Please log in first.");
      }

      const { error } = await supabase
        .from("marketplace")
        .insert({
          user_id: authData.user.id,
          name: form.name.trim(),
          farmer: form.farmer.trim(),
          location: form.location.trim(),
          price: Number(form.price),
          unit: form.unit,
          category: form.category,
        });

      if (error) throw error;

      setMessage("✅ Product published successfully!");

      setForm({
        name: "",
        farmer: "",
        location: "",
        price: "",
        unit: "kg",
        category: "Vegetables",
      });

      setShowForm(false);
      await loadProducts();
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    if (!user || product.user_id !== user.id) return;

    if (!window.confirm("Delete this product?")) return;

    const { error } = await supabase
      .from("marketplace")
      .delete()
      .eq("id", product.id)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Product deleted.");
      await loadProducts();
    }
  }

  const filtered = products.filter((product) => {
    const text =
      `${product.name} ${product.farmer} ${product.location}`
        .toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      (category === "All" || product.category === category)
    );
  });

  const categories = [
    "All",
    "Grains",
    "Vegetables",
    "Fruits",
    "Other",
  ];

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">
              🛒 Farmers Marketplace
            </h1>
            <p className="text-gray-600 mt-2">
              Buy fresh produce directly from farmers.
            </p>
          </div>

          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-700 text-white px-5 py-3 rounded-lg"
            >
              {showForm ? "Close Form" : "+ Sell Produce"}
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-green-700 text-white px-5 py-3 rounded-lg"
            >
              Login to Sell
            </Link>
          )}
        </div>

        {message && (
          <div
            role="status"
            className="bg-white border border-green-200 rounded-lg p-4 mb-6 text-green-900"
          >
            {message}
          </div>
        )}

        {showForm && user && (
          <form
            onSubmit={addProduct}
            className="bg-white rounded-xl shadow p-6 mb-8 grid md:grid-cols-2 gap-4"
          >
            <h2 className="text-xl font-bold text-green-900 md:col-span-2">
              Add Your Produce
            </h2>

            {[
              ["name", "Product Name"],
              ["farmer", "Farmer Name"],
              ["location", "Location"],
              ["price", "Price in ₹"],
            ].map(([field, label]) => (
              <input
                key={field}
                required
                type={field === "price" ? "number" : "text"}
                min={field === "price" ? "0.01" : undefined}
                step={field === "price" ? "any" : undefined}
                placeholder={label}
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
              <option value="kg">Per kg</option>
              <option value="quintal">Per quintal</option>
              <option value="ton">Per ton</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-700 text-white p-3 rounded-lg md:col-span-2 disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish Product"}
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            placeholder="Search crops, farmers or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 border rounded-lg p-3 bg-white text-gray-900"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg p-3 bg-white text-gray-900"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-700">Loading products...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="bg-green-100 text-center py-10 text-6xl">
                  🌾
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-green-900">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    👨‍🌾 {product.farmer}
                  </p>

                  <p className="text-gray-600">
                    📍 {product.location}
                  </p>

                  <p className="text-2xl text-green-700 font-bold my-4">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                    /{product.unit}
                  </p>

                  <InteractionPanel
                    kind="marketplace"
                    listingId={product.id}
                    ownerId={product.user_id}
                    user={user}
                  />

                  {user?.id === product.user_id ? (
                    <button
                      onClick={() => deleteProduct(product)}
                      className="bg-red-600 text-white w-full p-3 rounded-lg"
                    >
                      Delete My Listing
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Buyer contact feature coming next.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No products found. Add the first listing!
          </p>
        )}
      </div>
    </main>
  );
}
