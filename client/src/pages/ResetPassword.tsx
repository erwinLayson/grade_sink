import { useMemo, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useToastHelper } from "../context/ToastContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const toast = useToastHelper();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.warning("Both password fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:7000/auth/reset-password",
        {
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        { withCredentials: true },
      );

      setCompleted(true);
      toast.success(response.data?.msg || "Password updated successfully");
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
            Reset Password
          </h1>
          <p className="text-sm tracking-wide text-neutral-500">
            CREATE A NEW PASSWORD FOR YOUR ACCOUNT
          </p>
        </article>

        {completed ? (
          <div className="grid gap-6 text-center">
            <div className="border border-neutral-200 bg-neutral-50 p-6">
              <p className="text-sm font-semibold tracking-wide text-neutral-900">
                Password updated
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                You can now sign in with your new password.
              </p>
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
                htmlFor="new-password"
                className="text-xs font-semibold tracking-wide text-neutral-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                placeholder="Enter new password"
                className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
                value={newPassword}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="confirm-password"
                className="text-xs font-semibold tracking-wide text-neutral-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm new password"
                className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update password"}
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
