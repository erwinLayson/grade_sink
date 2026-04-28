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
    <main className="flex h-screen bg-slate-50">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
          <div
            onClick={toggleSidebar}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200 cursor-pointer"
            title="Toggle sidebar"
          >
            <FaBars className="text-lg" />
          </div>

          <div className="flex items-center gap-6">
            {/* User Info */}
            <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm">
                  {user?.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.username.toUpperCase()}
                </p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
            </div>

            {/* Settings */}
            <button
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              title="Settings"
            >
              <FaCog className="text-lg" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
