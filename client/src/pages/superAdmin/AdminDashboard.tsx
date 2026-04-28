import { useEffect, useState } from "react";
import axios from "axios";
import useUser from "../../hooks/useUser";

interface DashboardStats {
  totalTeachers: number;
  totalClasses: number;
  totalStudents: number;
  averageGrade: number;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalClasses: 0,
    totalStudents: 0,
    averageGrade: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Fetch dashboard statistics
        const [teachersRes, classesRes, studentsRes] = await Promise.all([
          axios.get("http://localhost:7000/teachers?limit=1000", {
            withCredentials: true,
          }),
          axios.get("http://localhost:7000/classes?limit=1000", {
            withCredentials: true,
          }),
          axios.get("http://localhost:7000/students?limit=1000", {
            withCredentials: true,
          }),
        ]);

        setStats({
          totalTeachers:
            teachersRes.data?.pagination?.total ??
            teachersRes.data?.data?.length ??
            0,
          totalClasses:
            classesRes.data?.pagination?.total ??
            classesRes.data?.data?.length ??
            0,
          totalStudents:
            studentsRes.data?.pagination?.total ??
            studentsRes.data?.data?.length ??
            0,
          averageGrade: 85.5, // Placeholder
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-slate-600 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-lg text-slate-600 mt-1">
          Welcome back, {user?.username}!
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Teachers Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-indigo-500 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Total Teachers
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stats.totalTeachers}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xl">
              👨‍🏫
            </div>
          </div>
        </div>

        {/* Classes Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-emerald-600 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Total Classes
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stats.totalClasses}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-xl">
              📚
            </div>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-purple-600 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Total Students
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stats.totalStudents}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
              🎓
            </div>
          </div>
        </div>

        {/* Average Grade Card */}
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-amber-500 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Average Grade
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stats.averageGrade.toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-xl">
              ⭐
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-100 p-6 hover:border-indigo-300 transition-all cursor-pointer">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Manage Teachers
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Add, edit, or remove teacher accounts
          </p>
          <a
            href="/admin/teachers"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Go to Teachers →
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-emerald-100 p-6 hover:border-emerald-300 transition-all cursor-pointer">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Manage Classes
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Create and manage school classes
          </p>
          <a
            href="/admin/classes"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Go to Classes →
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-2 border-purple-100 p-6 hover:border-purple-300 transition-all cursor-pointer">
          <h3 className="text-lg font-bold text-slate-900 mb-2">View Users</h3>
          <p className="text-slate-600 text-sm mb-4">
            Manage all system user accounts
          </p>
          <a
            href="/admin/users"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            Go to Users →
          </a>
        </div>
      </div>
    </article>
  );
}
