import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Custom hooks
import useUser from "../hooks/useUser";
import { useToastHelper } from "../context/ToastContext";

export default function Login() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPasword] = useState<string>("");

  // user
  const { user, setUser } = useUser();
  const toast = useToastHelper();

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`user `, user);
  }, [user]);

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

      setUserEmail("");
      setUserPasword("");
      toast.success("Login successful!");
      navigate("/");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return toast.error(e.response?.data?.msg || "Login failed");
      }

      throw new Error(`Error: ${e}`);
    }
  }

  return (
    <div className="grid place-items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <form
        className="max-w-md w-full shadow-lg border border-slate-200 rounded-2xl p-8 flex flex-col bg-white"
        onSubmit={handleFormSubmit}
      >
        <article className="grid place-items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center shadow-md">
            <img
              src="https://th.bing.com/th/id/OIP.pyCJLlr1nrBCaHdOdKXbbAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Grade Sink</h1>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </article>
        <article className="grid gap-5">
          {/* Email */}
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={userEmail}
              onChange={(e) => setUserEmail(e.currentTarget.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              value={userPassword}
              onChange={(e) => setUserPasword(e.currentTarget.value)}
            />
          </div>

          {/* Button */}
          <div className="grid gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              Sign In
            </button>

            <div className="flex items-center gap-3">
              <hr className="flex-1 border-slate-200" />
              <span className="text-xs text-slate-500">or</span>
              <hr className="flex-1 border-slate-200" />
            </div>

            {/* Forgot password */}
            <a
              href="#"
              className="text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Forgot password?
            </a>
          </div>
        </article>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 mt-6 pt-6 border-t border-slate-200">
          <p>© 2026 Grade Sink. All rights reserved.</p>
        </div>
      </form>
    </div>
  );
}
