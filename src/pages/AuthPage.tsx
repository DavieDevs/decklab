// src/pages/AuthPage.tsx
import { useState, FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("Please enter an email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage("Check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage("Logged in successfully.");
          // later: redirect to /build or /my-decks
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-8 text-neutral-100">
      <div className="w-full rounded-lg border border-neutral-800 bg-neutral-950/80 p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold">
          {mode === "login" ? "Log in to DeckLab" : "Create a DeckLab account"}
        </h1>

        <p className="mb-6 text-sm text-neutral-400">
          {mode === "login"
            ? "Enter your email and password to access your decks."
            : "Sign up to start building and saving your Yu-Gi-Oh! decks."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {message && <p className="text-xs text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-700"
          >
            {isSubmitting
              ? mode === "login"
                ? "Logging in..."
                : "Creating account..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-neutral-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setMessage(null);
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setMessage(null);
                }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
