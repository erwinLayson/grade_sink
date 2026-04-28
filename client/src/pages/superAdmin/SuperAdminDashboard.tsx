import { useEffect, useState } from "react";
import axios from "axios";
import useGetUser from "../../hooks/useGetUser";

interface DashboardStats {
  totalUsers: number;
  totalClasses: number;
  totalStudents: number;
  gradeDistribution: {
    below75: number;
    between75_79: number;
    between80_84: number;
    between85_89: number;
    between90_94: number;
    above95: number;
  };
  recentActivity: Array<{
    id: number;
    action: string;
    timestamp: string;
  }>;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { users } = useGetUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all data
        const [usersRes, classesRes, studentsRes, gradesRes] =
          await Promise.all([
            axios.get("http://localhost:7000/users?limit=1000", {
              withCredentials: true,
            }),
            axios.get("http://localhost:7000/classes?limit=1000", {
              withCredentials: true,
            }),
            axios.get("http://localhost:7000/students?limit=1000", {
              withCredentials: true,
            }),
            axios.get("http://localhost:7000/grades?limit=1000", {
              withCredentials: true,
            }),
          ]);

        const gradesData = gradesRes.data?.data || [];

        // Calculate grade distribution
        const distribution = {
          below75: gradesData.filter((g: any) => g.grade < 75).length,
          between75_79: gradesData.filter(
            (g: any) => g.grade >= 75 && g.grade <= 79,
          ).length,
          between80_84: gradesData.filter(
            (g: any) => g.grade >= 80 && g.grade <= 84,
          ).length,
          between85_89: gradesData.filter(
            (g: any) => g.grade >= 85 && g.grade <= 89,
          ).length,
          between90_94: gradesData.filter(
            (g: any) => g.grade >= 90 && g.grade <= 94,
          ).length,
          above95: gradesData.filter((g: any) => g.grade >= 95).length,
        };

        setStats({
          totalUsers: usersRes.data?.data?.length || 0,
          totalClasses: classesRes.data?.data?.length || 0,
          totalStudents: studentsRes.data?.data?.length || 0,
          gradeDistribution: distribution,
          recentActivity: [],
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

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <h2 className="font-bold">Error loading dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Super Admin Dashboard
        </h1>
        <p className="text-lg text-slate-600">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 p-6 border-l-4 border-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <div className="text-indigo-500 text-3xl">👥</div>
          </div>
        </div>

        {/* Total Classes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 p-6 border-l-4 border-emerald-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Total Classes
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.totalClasses || 0}
              </p>
            </div>
            <div className="text-emerald-600 text-3xl">📚</div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 p-6 border-l-4 border-purple-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Total Students
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats?.totalStudents || 0}
              </p>
            </div>
            <div className="text-purple-600 text-3xl">🎓</div>
          </div>
        </div>

        {/* User Activity Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 p-6 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Activity Logs
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">Tracking</p>
            </div>
            <div className="text-amber-500 text-3xl">📋</div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Grade Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-rose-50 rounded-lg border border-rose-200">
            <p className="text-sm text-slate-600 font-medium mb-2">Below 75</p>
            <p className="text-2xl font-bold text-rose-600">
              {stats?.gradeDistribution.below75 || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-slate-600 font-medium mb-2">75-79</p>
            <p className="text-2xl font-bold text-amber-600">
              {stats?.gradeDistribution.between75_79 || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-slate-600 font-medium mb-2">80-84</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats?.gradeDistribution.between80_84 || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-lime-50 rounded-lg border border-lime-200">
            <p className="text-sm text-slate-600 font-medium mb-2">85-89</p>
            <p className="text-2xl font-bold text-lime-600">
              {stats?.gradeDistribution.between85_89 || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-slate-600 font-medium mb-2">90-94</p>
            <p className="text-2xl font-bold text-emerald-600">
              {stats?.gradeDistribution.between90_94 || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-sm text-slate-600 font-medium mb-2">95+</p>
            <p className="text-2xl font-bold text-teal-600">
              {stats?.gradeDistribution.above95 || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/manage-users"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 cursor-pointer"
          >
            <p className="font-semibold text-indigo-600 mb-1">Manage Users</p>
            <p className="text-sm text-slate-600">
              Create and manage user accounts
            </p>
          </a>
          <a
            href="/manage-teachers"
            className="p-4 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 cursor-pointer"
          >
            <p className="font-semibold text-emerald-600 mb-1">
              Manage Teachers
            </p>
            <p className="text-sm text-slate-600">
              Add and manage teacher information
            </p>
          </a>
          <a
            href="/manage-classes"
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 cursor-pointer"
          >
            <p className="font-semibold text-purple-600 mb-1">Manage Classes</p>
            <p className="text-sm text-slate-600">
              Create and organize classes
            </p>
          </a>
        </div>
      </div>
    </article>
  );
}
