"use client";
import InteractionPanel from "@/components/InteractionPanel";


import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const config = {
  barter: {
    title: "🔄 Barter Exchange",
    fields: ["farmer", "location", "offering", "wants"],
  },
  rentals: {
    title: "🚜 Farm Rentals",
    fields: ["name", "owner", "location", "price"],
  },
  community: {
    title: "👥 Farmer Community",
    fields: ["author", "message"],
  },
};

export default function DatabaseBoard({ section }) {
  const settings = config[section];
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from(section)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setMessage("Load error: " + error.message);
    else setItems(data || []);

    setLoading(false);
  }

  useEffect(() => {
    loadItems();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => listener.subscription.unsubscribe();
  }, [section]);

  async function publish(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const { data, error: authError } =
        await supabase.auth.getUser();

      if (authError || !data.user) {
        throw new Error("Please login first.");
      }

      const payload = {
        ...form,
        user_id: data.user.id,
      };

      if (section === "rentals") {
        payload.price = Number(form.price);
        payload.unit = "day";
        payload.category = "Machinery";
      }

      const { data: saved, error } = await supabase
        .from(section)
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;

      setMessage("✅ Saved to Supabase! ID: " + saved.id);
      setShowForm(false);
      setForm({});
      await loadItems();
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (user?.id !== item.user_id) return;
    if (!window.confirm("Delete this item?")) return;

    const { error } = await supabase
      .from(section)
      .delete()
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (error) setMessage("❌ " + error.message);
    else {
      setMessage("✅ Deleted");
      await loadItems();
    }
  }

  if (!settings) return <p>Invalid section</p>;

  const results = items.filter((item) =>
    settings.fields.some((field) =>
      String(item[field] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-900 mb-6">
          {settings.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          {user ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-700 text-white p-3 rounded-lg"
            >
              + Add New
            </button>
          ) : (
            <Link href="/login"
              className="bg-green-700 text-white p-3 rounded-lg">
              Login to Post
            </Link>
          )}

          <button onClick={loadItems}
            className="border border-green-700 text-green-800 p-3 rounded-lg">
            Refresh Listings
          </button>
        </div>

        {message && (
          <p role="status" className="bg-white p-4 rounded-lg mb-5 break-all text-gray-800">
            {message}
          </p>
        )}

        {showForm && user && (
          <form onSubmit={publish}
            className="bg-white rounded-xl p-6 shadow mb-6 grid gap-4">
            {settings.fields.map((field) => (
              <input
                key={field}
                required
                type={field === "price" ? "number" : "text"}
                min={field === "price" ? "1" : undefined}
                step={field === "price" ? "any" : undefined}
                placeholder={field.toUpperCase()}
                value={form[field] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="border rounded-lg p-3 text-gray-900"
              />
            ))}
            <button disabled={saving}
              className="bg-green-700 text-white p-3 rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : "Publish to Database"}
            </button>
          </form>
        )}

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6 bg-white text-gray-900"
        />

        {loading && <p>Loading database...</p>}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((item) => (
              <div key={item.id}
                className="bg-white p-6 rounded-xl shadow">
                {settings.fields.map((field) => (
                  <p key={field} className="text-gray-800 mb-2 break-words">
                    <strong className="capitalize">{field}: </strong>
                    {item[field]}
                  </p>
                ))}

                <InteractionPanel
                  kind={section}
                  listingId={item.id}
                  ownerId={item.user_id}
                  user={user}
                />

                {user?.id === item.user_id && (
                  <button onClick={() => remove(item)}
                    className="bg-red-600 text-white p-2 rounded-lg mt-3">
                    Delete My Listing
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <p className="text-gray-600 mt-5">
            No records found in Supabase.
          </p>
        )}
      </div>
    </main>
  );
}
