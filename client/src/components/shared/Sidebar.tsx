import { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";

// context
import { useSideBar } from "../../hooks/useSidebar";
import { useToast, useToastHelper } from "../../context/ToastContext";

// Constant
import { DEFAULT_NAV_CONFIG } from "../../constant/sidebar";

// Type
import type { SideBarProps } from "../../constant/sidebar";
import type { ROLE } from "../../constant/user";
import { FaSignOutAlt } from "react-icons/fa";

export default function SideBar({
  teacher = DEFAULT_NAV_CONFIG.teacher,
  admin = DEFAULT_NAV_CONFIG.admin,
  super_admin = DEFAULT_NAV_CONFIG.super_admin,
}: Partial<SideBarProps> = {}) {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const setUser = userContext?.setUser;
  const userRole = user?.role as ROLE;

  const { isOpen } = useSideBar();
  const toast = useToastHelper();
  const { addToast } = useToast();

  if (!user) {
    return (
      <aside className="sidebar">
        <p>Please log in</p>
      </aside>
    );
  }

  const navConfig = { teacher, admin, super_admin };
  const navItems = navConfig[userRole] || [];

  async function performLogout() {
    try {
      await axios.post(
        "http://localhost:7000/logout",
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("userCredential");
      setUser?.(null);
      toast.success("Logged out successfully");
      window.location.replace("/login");
    }
  }

  function handleLogout() {
    addToast({
      type: "error",
      message: "Are you sure you want to log out?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          await performLogout();
        },
      },
    });
  }

  return (
    <aside
      className={`bg-slate-900 shadow-xl min-h-screen sidebar ${isOpen ? "open" : "close"} flex flex-col gap-20 transition-all duration-300`}
    >
      <header className="grid max-h-16 border-b border-slate-700">
        <article className="flex items-center justify-center gap-2 py-4 px-4">
          <div
            className={`transition-all duration-300 overflow-hidden ${isOpen ? "w-12 h-12" : "w-8 h-8"}`}
          >
            <img
              src="https://th.bing.com/th/id/OIP.pyCJLlr1nrBCaHdOdKXbbAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="school logo"
              className={`w-full h-full object-cover shrink-0 rounded-lg`}
            />
          </div>
          <p
            className={`${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"} text-sm font-semibold text-white shrink-1 transition-all duration-300`}
          >
            Grade Sink
          </p>
        </article>
      </header>

      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-slate-300 hover:text-white hover:bg-indigo-600`}
                >
                  {IconComponent && (
                    <IconComponent className={`text-lg flex-shrink-0`} />
                  )}
                  <span
                    className={`transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"} font-medium text-sm`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="border-t border-slate-700 p-4 text-center text-xs text-slate-400">
        <div className="px-2 pb-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-rose-300 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-100"
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            <span
              className={`transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"} font-medium text-sm`}
            >
              Logout
            </span>
          </button>
        </div>
        <p>© 2026 Grade Sink</p>
      </footer>
    </aside>
  );
}
