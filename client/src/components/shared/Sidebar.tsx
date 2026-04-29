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
      <aside className="sidebar border-r border-neutral-200 bg-white p-4">
        <p className="text-sm text-neutral-600">Please log in</p>
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
      className={`sidebar ${isOpen ? "open" : "close"} flex min-h-screen flex-col gap-12 border-r border-neutral-200 bg-white transition-all duration-300`}
    >
      <header className="grid max-h-16 border-b border-neutral-200">
        <article className="flex items-center justify-center gap-2 px-4 py-4">
          <div
            className={`overflow-hidden rounded-full border border-neutral-300 bg-neutral-50 transition-all duration-300 ${isOpen ? "h-10 w-10" : "h-8 w-8"}`}
          >
            <img
              src="https://th.bing.com/th/id/OIP.pyCJLlr1nrBCaHdOdKXbbAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="school logo"
              className="h-full w-full shrink-0 object-cover"
            />
          </div>
          <p
            className={`${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"} shrink-1 text-sm font-semibold tracking-wide text-neutral-900 transition-all duration-300`}
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
                  className="flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 text-neutral-600 transition-all duration-200 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  {IconComponent && (
                    <IconComponent className="text-lg flex-shrink-0" />
                  )}
                  <span
                    className={`font-medium text-sm transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "hidden w-0 opacity-0"}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="border-t border-neutral-200 p-4 text-center text-xs text-neutral-500">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl border border-transparent px-4 py-3 text-left text-neutral-600 transition-all duration-200 hover:border-neutral-200 hover:bg-neutral-100 hover:text-black"
        >
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          <span
            className={`font-medium text-sm transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "hidden w-0 opacity-0"}`}
          >
            Logout
          </span>
        </button>
        <p>© 2026 Grade Sink</p>
      </footer>
    </aside>
  );
}
