import { FaBars, FaCog } from "react-icons/fa";

import { Outlet } from "react-router-dom";

// Hooks custom
import useUser from "../../hooks/useUser";
import { useSideBar } from "../../hooks/useSidebar";

import SideBar from "./Sidebar";

export default function MasterLayout() {
  const { user } = useUser();
  const { toggleSidebar } = useSideBar();

  return (
    <main className="flex h-screen bg-neutral-100 text-neutral-900">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">
          <div
            onClick={toggleSidebar}
            className="cursor-pointer rounded-full border border-neutral-300 p-2 text-neutral-700 transition hover:border-neutral-500 hover:text-black"
            title="Toggle sidebar"
          >
            <FaBars className="text-lg" />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* User Info */}
            <div className="flex items-center gap-3 border-r border-neutral-200 pr-4 md:pr-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-50">
                <span className="text-sm font-semibold text-neutral-800">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold tracking-wide text-neutral-900">
                  {user?.username.toUpperCase()}
                </p>
                <p className="text-xs uppercase tracking-wider text-neutral-500">
                  {user?.role?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Settings */}
            <button
              className="cursor-pointer rounded-full border border-neutral-300 p-2 text-neutral-700 transition hover:border-neutral-500 hover:text-black"
              title="Settings"
            >
              <FaCog className="text-lg" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <div className="fade-in min-h-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_20px_50px_-45px_rgba(0,0,0,0.6)] md:p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
