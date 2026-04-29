import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

// Custom hooks
import useUser from "../hooks/useUser";
import useGetUser from "../hooks/useGetUser";
import { useToastHelper } from "../context/ToastContext";
import { getDashboardRoute } from "../utils/dashboardRoute";
import type { ROLE } from "../constant/user";

export default function Login() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPasword] = useState<string>("");

  // user
  const { user, setUser } = useUser();
  const { refetchUsers } = useGetUser();
  const toast = useToastHelper();

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const dashboardRoute = getDashboardRoute(user.role);

    if (dashboardRoute) {
      navigate(dashboardRoute, { replace: true });
      return;
    }

    toast.error("Your account role does not have a dashboard route.");
    localStorage.removeItem("userCredential");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate, setUser, toast, user]);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userEmail) {
      toast.warning("Email is Required");
      return;
    }
    if (!userPassword) {
      toast.warning("Password is Required");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:7000/auth",
        { email: userEmail, password: userPassword },
        { withCredentials: true },
      );

      const userCredential = {
        id: result.data?.data?.id,
        username: result.data?.data?.username,
        email: result.data?.data?.email,
        role: result.data?.data?.role,
      };

      localStorage.setItem("userCredential", JSON.stringify(userCredential));
      setUser(userCredential);

      const shouldLoadUsersList: ROLE[] = ["admin", "super_admin"];
      if (shouldLoadUsersList.includes(userCredential.role)) {
        await refetchUsers();
      }

      setUserEmail("");
      setUserPasword("");
      toast.success("Login successful!");

      const dashboardRoute = getDashboardRoute(userCredential.role);
      if (dashboardRoute) {
        navigate(dashboardRoute, { replace: true });
        return;
      }

      toast.error("Your account role does not have a dashboard route.");
      localStorage.removeItem("userCredential");
      setUser(null);
      navigate("/login", { replace: true });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return toast.error(e.response?.data?.msg || "Login failed");
      }

      throw new Error(`Error: ${e}`);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-neutral-100 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full border border-neutral-300/80" />
      <div className="pointer-events-none absolute -right-28 bottom-4 h-72 w-72 rounded-full border border-neutral-300/80" />

      <form
        className="fade-in w-full max-w-md border border-neutral-200 bg-white/95 p-8 shadow-[0_18px_60px_-38px_rgba(0,0,0,0.45)] backdrop-blur-sm"
        onSubmit={handleFormSubmit}
      >
        <article className="mb-10 grid place-items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-neutral-300 bg-neutral-50">
            <img
              src="https://th.bing.com/th/id/OIP.pyCJLlr1nrBCaHdOdKXbbAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Grade Sink logo"
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-center text-4xl font-semibold tracking-tight text-neutral-900">
            Grade Sink
          </h1>
          <p className="text-sm tracking-wide text-neutral-500">
            SIGN IN TO CONTINUE
          </p>
        </article>

        <article className="grid gap-6">
          {/* Email */}
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-wide text-neutral-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
              value={userEmail}
              onChange={(e) => setUserEmail(e.currentTarget.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wide text-neutral-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900"
              value={userPassword}
              onChange={(e) => setUserPasword(e.currentTarget.value)}
            />
          </div>

          {/* Button */}
          <div className="grid gap-4 pt-2">
            <button
              type="submit"
              className="w-full border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
            >
              Sign In
            </button>

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-neutral-200" />
              <span className="text-xs tracking-wide text-neutral-400">OR</span>
              <hr className="flex-1 border-neutral-200" />
            </div>

            {/* Forgot password */}
            <Link
              to="/forgot-password"
              className="text-center text-sm font-medium text-neutral-700 underline-offset-4 transition hover:text-black hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </article>

        {/* Footer */}
        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
          <p>© 2026 Grade Sink. All rights reserved.</p>
        </div>
      </form>
    </div>
  );
}
