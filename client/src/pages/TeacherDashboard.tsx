import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";

interface TeacherClass {
  id: number;
  name: string;
  section: string;
  school_year: string;
  school_level: string;
}

interface TeacherSubject {
  id: number;
  code: string;
  name: string;
}

export default function TeacherDashboard() {
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [handledClasses, setHandledClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        if (user.role === "teacher") {
          // resolve teacher record by email to get teachers.id
          const tRes = await axios.get(
            `http://localhost:7000/teachers/email/${encodeURIComponent(user.email)}`,
            { withCredentials: true },
          );
          const teacher = tRes.data?.data;
          const teacherId = teacher?.id ?? user.id;
          await fetchTeacherData(teacherId);
        } else {
          // non-teacher roles: use user.id
          await fetchTeacherData(user.id);
        }
      } catch (err) {
        // fallback to using user.id
        await fetchTeacherData(user.id);
      }
    };

    load();
  }, [user?.id]);

  const fetchTeacherData = async (teacherId?: number) => {
    try {
      setLoading(true);
      const id = teacherId ?? user?.id;
      const [classRes, subjectRes, handledRes] = await Promise.all([
        axios.get(
          `http://localhost:7000/class-teachers/teacher/${id}?limit=1000`,
          { withCredentials: true },
        ),
        axios.get(
          `http://localhost:7000/teacher-subjects/teacher/${id}?limit=1000`,
          { withCredentials: true },
        ),
        axios.get(
          `http://localhost:7000/class-subjects/teacher/${id}?limit=1000`,
          { withCredentials: true },
        ),
      ]);
      setClasses(classRes.data?.data || []);
      setSubjects(subjectRes.data?.data || []);
      setHandledClasses(handledRes.data?.data || []);
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

  if (loading)
    return (
      <div className="p-8 text-center text-lg text-slate-600 bg-slate-50 min-h-screen">
        Loading dashboard...
      </div>
    );

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome, {user?.first_name}
        </h1>
        <p className="text-lg text-slate-600">
          Manage your classes and subjects
        </p>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-lg mb-6 border border-rose-200">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchTeacherData}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 p-6">
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            {classes.length}
          </div>
          <p className="text-slate-600 font-medium">Classes</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 p-6">
          <div className="text-4xl font-bold text-emerald-600 mb-2">
            {subjects.length}
          </div>
          <p className="text-slate-600 font-medium">Subjects</p>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">My Classes</h2>
        </div>
        {classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Section
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {classes.map((cls) => (
                  <tr
                    key={cls.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-900">{cls.name}</td>
                    <td className="px-6 py-4 text-slate-600">{cls.section}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {cls.school_year}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cls.school_level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium">No classes assigned</p>
          </div>
        )}
      </div>

      {/* Subjects Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">My Subjects</h2>
        </div>
        {subjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {subject.code}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{subject.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium">No subjects assigned</p>
          </div>
        )}
      </div>

      {/* Classes With My Subjects Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-8">
        <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            Classes With My Subjects
          </h2>
        </div>
        {handledClasses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Class
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Section
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {handledClasses.map((cls) => (
                  <tr
                    key={cls.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-900">{cls.name}</td>
                    <td className="px-6 py-4 text-slate-600">{cls.section}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {cls.school_year}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {cls.school_level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium">No classes contain your subjects</p>
          </div>
        )}
      </div>
    </article>
  );
}
