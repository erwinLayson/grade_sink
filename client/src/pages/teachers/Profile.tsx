import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { useToastHelper } from "../../context/ToastContext";
import { FaLock, FaSave, FaUserEdit } from "react-icons/fa";

type TeacherProfileData = {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string;
  username: string;
  role: string;
};

type FormState = {
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  email: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const INITIAL_FORM: FormState = {
  first_name: "",
  middle_name: "",
  last_name: "",
  username: "",
  email: "",
  current_password: "",
  new_password: "",
  confirm_password: "",
};

export default function TeacherProfile() {
  const context = useContext(UserContext);
  const user = context?.user;
  const setUser = context?.setUser;
  const toast = useToastHelper();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<TeacherProfileData | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/teachers/me/profile",
          {
            withCredentials: true,
          },
        );

        const data = response.data?.data as TeacherProfileData;

        setProfile(data);
        setForm({
          first_name: data.first_name ?? "",
          middle_name: data.middle_name ?? "",
          last_name: data.last_name ?? "",
          username: data.username ?? "",
          email: data.email ?? "",
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setError(null);
      } catch (e) {
        const errorMsg = axios.isAxiosError(e)
          ? e.response?.data?.msg || e.message
          : String(e);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const accountChanged = useMemo(() => {
    if (!profile) {
      return false;
    }

    return (
      form.username.trim() !== (profile.username ?? "") ||
      form.email.trim().toLowerCase() !== (profile.email ?? "").toLowerCase() ||
      form.new_password.trim().length > 0
    );
  }, [form.email, form.new_password, form.username, profile]);

  const basicInfoChanged = useMemo(() => {
    if (!profile) {
      return false;
    }

    return (
      form.first_name.trim() !== (profile.first_name ?? "") ||
      form.middle_name.trim() !== (profile.middle_name ?? "") ||
      form.last_name.trim() !== (profile.last_name ?? "")
    );
  }, [form.first_name, form.last_name, form.middle_name, profile]);

  const canSubmit = basicInfoChanged || accountChanged;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      toast.info("No changes to save");
      return;
    }

    if (accountChanged && !form.current_password.trim()) {
      toast.warning("Current password is required for account updates");
      return;
    }

    if (form.new_password && form.new_password !== form.confirm_password) {
      toast.error("New password and confirmation do not match");
      return;
    }

    const payload: Record<string, string> = {};

    if (basicInfoChanged || accountChanged) {
      payload.first_name = form.first_name.trim();
      payload.middle_name = form.middle_name.trim();
      payload.last_name = form.last_name.trim();
      payload.username = form.username.trim();
      payload.email = form.email.trim().toLowerCase();
    }

    if (accountChanged) {
      payload.current_password = form.current_password;
    }

    if (form.new_password.trim()) {
      payload.new_password = form.new_password;
      payload.confirm_password = form.confirm_password;
    }

    try {
      setSaving(true);
      const response = await axios.put(
        "http://localhost:7000/teachers/me/profile",
        payload,
        { withCredentials: true },
      );

      const updatedUser = response.data?.data;

      if (updatedUser && setUser) {
        setUser(updatedUser);
        localStorage.setItem("userCredential", JSON.stringify(updatedUser));
      }

      setProfile((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          first_name: payload.first_name ?? prev.first_name,
          middle_name: payload.middle_name ?? prev.middle_name,
          last_name: payload.last_name ?? prev.last_name,
          username: updatedUser?.username ?? payload.username ?? prev.username,
          email: updatedUser?.email ?? payload.email ?? prev.email,
        };
      });

      setForm((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: "",
      }));

      toast.success("Profile updated successfully");
      setError(null);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center text-lg text-slate-600">
        Loading profile...
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Teacher Profile
        </h1>
        <p className="text-lg text-slate-600">
          Update your basic profile details and account settings.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 bg-slate-50/80 p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
              <FaUserEdit className="text-lg" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Editable teacher details from your profile record.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              First Name
            </span>
            <input
              value={form.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Middle Name
            </span>
            <input
              value={form.middle_name}
              onChange={(e) => handleChange("middle_name", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Last Name
            </span>
            <input
              value={form.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
        </div>

        <div className="border-y border-slate-200 bg-slate-50/60 p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
              <FaLock className="text-lg" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Account Settings
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Email and username updates require your current password.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Username
            </span>
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700">
              Current Password
            </span>
            <input
              type="password"
              value={form.current_password}
              onChange={(e) => handleChange("current_password", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              autoComplete="current-password"
              placeholder="Required when changing email, username, or password"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              New Password
            </span>
            <input
              type="password"
              value={form.new_password}
              onChange={(e) => handleChange("new_password", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              autoComplete="new-password"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">
              Confirm New Password
            </span>
            <input
              type="password"
              value={form.confirm_password}
              onChange={(e) => handleChange("confirm_password", e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              autoComplete="new-password"
            />
          </label>
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 p-6">
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {user && (
        <p className="mt-4 text-sm text-slate-500">Signed in as {user.role}</p>
      )}
    </article>
  );
}
