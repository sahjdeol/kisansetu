"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/login",
          },
        });

        if (error) throw error;

        setMessage(
          data.session
            ? "Account created. You are logged in!"
            : "Check your email to confirm your account."
        );
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;
        setMessage("Login successful!");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : "Logged out!");
  }

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-800 text-center">
          🌾 Kisan Setu
        </h1>

        <p className="text-center text-gray-600 mb-8 mt-2">
          Farmer Login & Registration
        </p>

        {user ? (
          <div className="text-center">
            <p className="text-green-700 font-bold">
              ✅ Successfully Logged In
            </p>
            <p className="my-5 text-gray-700 break-all">
              {user.email}
            </p>
            <button
              onClick={logout}
              className="bg-red-600 text-white rounded-lg px-6 py-3"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setSignup(false)}
                className="flex-1 bg-green-700 text-white p-3 rounded-lg"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setSignup(true)}
                className="flex-1 bg-green-100 text-green-900 p-3 rounded-lg"
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3 text-gray-900"
              />

              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3 text-gray-900"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white rounded-lg p-3 font-bold disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : signup
                  ? "Create Account"
                  : "Login"}
              </button>
            </form>
          </>
        )}

        {message && (
          <p role="status" className="mt-5 text-center text-green-800">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
