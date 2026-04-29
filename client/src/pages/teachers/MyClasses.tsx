import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import {
  FaArrowRight,
  FaBook,
  FaSchool,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

interface TeacherClass {
  id: number;
  name: string;
  section: string;
  school_year: string;
  school_level: string;
}

interface ClassStudent {
  id: number;
  student_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  sex?: string;
}

interface TeacherSubject {
  id: number;
  code: string;
  name: string;
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
        <div className={`rounded-2xl p-3 ${tone}`}>{icon}</div>
      </div>
    </div>
  );
}

function PanelCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/80 p-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function MyClasses() {
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [handledClasses, setHandledClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [selectedClassStudents, setSelectedClassStudents] = useState<
    ClassStudent[]
  >([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        let teacherId = user.id;

        if (user.role === "teacher") {
          const teacherResponse = await axios.get(
            `http://localhost:7000/teachers/email/${encodeURIComponent(user.email)}`,
            { withCredentials: true },
          );
          teacherId = teacherResponse.data?.data?.id ?? user.id;
        }

        const [classRes, subjectRes, handledRes] = await Promise.all([
          axios.get(
            `http://localhost:7000/class-teachers/teacher/${teacherId}?limit=1000`,
            { withCredentials: true },
          ),
          axios.get(
            `http://localhost:7000/teacher-subjects/teacher/${teacherId}?limit=1000`,
            { withCredentials: true },
          ),
          axios.get(
            `http://localhost:7000/class-subjects/teacher/${teacherId}?limit=1000`,
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

    load();
  }, [user]);

  const openClassDrawer = async (cls: TeacherClass) => {
    setSelectedClass(cls);
    setSelectedClassStudents([]);
    setDrawerError(null);
    setDrawerLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:7000/class-students/class/${cls.id}?limit=1000`,
        { withCredentials: true },
      );

      setSelectedClassStudents(response.data?.data || []);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      setDrawerError(errorMsg);
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeClassDrawer = () => {
    setSelectedClass(null);
    setSelectedClassStudents([]);
    setDrawerError(null);
    setDrawerLoading(false);
  };

  const formatStudentName = (student: ClassStudent) => {
    const middleInitial = student.middle_name
      ? ` ${student.middle_name.charAt(0).toUpperCase()}.`
      : "";

    return `${student.first_name}${middleInitial} ${student.last_name}`.replace(
      /\s+/g,
      " ",
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg text-slate-600 bg-slate-50 min-h-screen">
        Loading classes...
      </div>
    );
  }

  const renderClassCard = (cls: TeacherClass, accent: string) => (
    <button
      key={cls.id}
      type="button"
      onClick={() => openClassDrawer(cls)}
      className="text-left rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Class
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 leading-tight">
            {cls.name}
          </h3>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${accent}`}
        >
          {cls.school_level}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Section
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {cls.section}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Year
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {cls.school_year}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Level
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {cls.school_level}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
        <span>View students</span>
        <FaArrowRight className="text-slate-400" />
      </div>
    </button>
  );

  const renderSubjectCard = (subject: TeacherSubject) => (
    <div
      key={subject.id}
      className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Subject
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 leading-tight">
            {subject.name}
          </h3>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {subject.code}
        </div>
      </div>
    </div>
  );

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Classes</h1>
          <p className="text-lg text-slate-600 leading-7">
            Advisory classes, handled subjects, and classes where those subjects
            are assigned.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-2xl mb-6 border border-rose-200">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          label="Advisory Classes"
          value={classes.length}
          icon={<FaSchool className="text-xl" />}
          tone="bg-indigo-50 text-indigo-700"
        />
        <SummaryCard
          label="Handled Subjects"
          value={subjects.length}
          icon={<FaBook className="text-xl" />}
          tone="bg-emerald-50 text-emerald-700"
        />
        <SummaryCard
          label="Classes Using My Subjects"
          value={handledClasses.length}
          icon={<FaArrowRight className="text-xl" />}
          tone="bg-cyan-50 text-cyan-700"
        />
      </div>

      <PanelCard
        title="My Classes"
        description="Advisory classes assigned to you."
      >
        {classes.length > 0 ? (
          <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {classes.map((cls) =>
              renderClassCard(cls, "bg-indigo-50 text-indigo-700"),
            )}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            <p className="font-medium">No classes assigned</p>
          </div>
        )}
      </PanelCard>

      <PanelCard
        title="My Subjects"
        description="Subjects you are assigned to handle."
      >
        {subjects.length > 0 ? (
          <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((subject) => renderSubjectCard(subject))}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            <p className="font-medium">No subjects assigned</p>
          </div>
        )}
      </PanelCard>

      <PanelCard
        title="Classes With My Subjects"
        description="Classes where your subject assignments are used."
      >
        {handledClasses.length > 0 ? (
          <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {handledClasses.map((cls) =>
              renderClassCard(cls, "bg-emerald-50 text-emerald-700"),
            )}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            <p className="font-medium">No classes contain your subjects</p>
          </div>
        )}
      </PanelCard>

      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <button
            type="button"
            aria-label="Close student drawer"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            onClick={closeClassDrawer}
          />

          <aside className="relative z-10 flex h-full w-full max-w-[460px] flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50/80 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Class students
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {selectedClass.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
                    {selectedClass.section} • {selectedClass.school_year} •{" "}
                    {selectedClass.school_level}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeClassDrawer}
                  className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close drawer"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Students
                  </p>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {selectedClassStudents.length}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Section
                  </p>
                  <div className="mt-2 text-lg font-bold text-slate-900">
                    {selectedClass.section}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Level
                  </p>
                  <div className="mt-2 text-lg font-bold text-slate-900">
                    {selectedClass.school_level}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {drawerLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                  Loading students...
                </div>
              ) : drawerError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                  {drawerError}
                </div>
              ) : selectedClassStudents.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Student ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Sex
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {selectedClassStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="transition-colors hover:bg-slate-50"
                          >
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900">
                                {formatStudentName(student)}
                              </div>
                              {student.middle_name && (
                                <div className="mt-1 text-xs text-slate-500">
                                  Middle name: {student.middle_name}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {student.student_id}
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                                {student.sex || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                  No students found in this class.
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </article>
  );
}
