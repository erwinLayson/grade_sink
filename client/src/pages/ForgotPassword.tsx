import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useToastHelper } from "../context/ToastContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToastHelper();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:7000/auth/forgot-password",
        { email },
        { withCredentials: true },
      );

      setResetLink(response.data?.data?.resetLink || null);
      setSubmitted(true);
      toast.success(response.data?.msg || "Reset link prepared");
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.msg || error.message
        : String(error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-neutral-100 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full border border-neutral-300/80" />
      <div className="pointer-events-none absolute -right-28 bottom-4 h-72 w-72 rounded-full border border-neutral-300/80" />

      <div className="fade-in w-full max-w-md border border-neutral-200 bg-white/95 p-8 shadow-[0_18px_60px_-38px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        <article className="mb-10 grid place-items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-300 bg-neutral-50 text-xl font-semibold text-neutral-900">
            GS
          </div>
          <h1 className="text-center text-4xl font-semibold tracking-tight text-neutral-900">
            Reset Access
          </h1>
          <p className="text-sm tracking-wide text-neutral-500">
            ENTER YOUR EMAIL TO RECEIVE A RESET LINK
          </p>
        </article>

        {submitted ? (
          <div className="grid gap-6 text-center">
            <div className="border border-neutral-200 bg-neutral-50 p-6">
              <p className="text-sm font-semibold tracking-wide text-neutral-900">
                Check your email
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                If an account exists for{" "}
                <span className="font-medium text-neutral-900">{email}</span>, a
                reset link has been sent.
              </p>
              {resetLink && (
                <a
                  href={resetLink}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
                >
                  Open reset link
                </a>
              )}
            </div>

            <Link
              to="/login"
              className="w-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label
                htmlFor="forgot-email"
                className="text-xs font-semibold tracking-wide text-neutral-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="forgot-email"
                placeholder="you@example.com"
                className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <Link
              to="/login"
              className="text-center text-sm font-medium text-neutral-700 underline-offset-4 transition hover:text-black hover:underline"
            >
              Back to login
            </Link>
          </form>
        )}

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
          <p>© 2026 Grade Sink. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
