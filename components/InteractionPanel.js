"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const tables = {
  marketplace: "marketplace_requests",
  barter: "barter_requests",
  rentals: "rental_requests",
  community: "community_comments",
};

export default function InteractionPanel({
  kind,
  listingId,
  ownerId,
  user,
}) {
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const isCommunity = kind === "community";
  const isOwner = user?.id === ownerId;
  const table = tables[kind];

  useEffect(() => {
    if (!table || !listingId) return;

    let active = true;

    async function load() {
      if (!isCommunity && !user) {
        if (active) setRecords([]);
        return;
      }

      const column = isCommunity ? "post_id" : "listing_id";

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(column, listingId)
        .order("created_at", { ascending: false });

      if (active) {
        if (error) setStatus(error.message);
        else setRecords(data || []);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [kind, listingId, user?.id]);

  async function submit(e) {
    e.preventDefault();

    if (!user) {
      setStatus("Please log in first.");
      return;
    }

    if (!isCommunity && isOwner) return;
    if (!message.trim() || saving) return;

    setSaving(true);
    setStatus("");

    const payload = isCommunity
      ? {
          post_id: listingId,
          user_id: user.id,
          message: message.trim(),
        }
      : {
          listing_id: listingId,
          requester_id: user.id,
          message: message.trim(),
        };

    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      setStatus("Error: " + error.message);
    } else {
      setRecords((old) => [data, ...old]);
      setMessage("");
      setStatus(
        isCommunity
          ? "✅ Comment posted!"
          : "✅ Request sent successfully!"
      );
    }

    setSaving(false);
  }

  if (!table) return null;

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <h3 className="font-bold text-green-900 mb-3">
        {isCommunity
          ? "💬 Comments"
          : isOwner
          ? "📩 Received Requests"
          : "📨 Send Request"}
      </h3>

      {records.length > 0 && (
        <div className="space-y-2 mb-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-green-50 rounded-lg p-3"
            >
              <p className="text-sm text-gray-800 break-words">
                {record.message}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(record.created_at).toLocaleString()}
              </p>

              {!isCommunity && (
                <p className="text-xs text-green-700 mt-1">
                  Status: {record.status}
                  {record.requester_id === user?.id
                    ? " (Sent by you)"
                    : " (Received)"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {(!isOwner || isCommunity) && (
        user ? (
          <form onSubmit={submit} className="space-y-3">
            <textarea
              required
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isCommunity
                  ? "Write a comment..."
                  : "Describe your request..."
              }
              className="w-full border rounded-lg p-3 text-gray-900 bg-white"
              rows={3}
            />

            <button
              type="submit"
              disabled={saving || !message.trim()}
              className="bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {saving
                ? "Sending..."
                : isCommunity
                ? "Post Comment"
                : "Send Request"}
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="text-green-700 font-semibold underline"
          >
            Login to {isCommunity ? "comment" : "send request"}
          </Link>
        )
      )}

      {status && (
        <p role="status" className="text-sm text-gray-700 mt-3 break-words">
          {status}
        </p>
      )}
    </div>
  );
}
