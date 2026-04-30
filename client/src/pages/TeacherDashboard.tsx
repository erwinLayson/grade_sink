import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import {
  FaChartBar,
  FaSchool,
  FaUsers,
  FaDownload,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useToastHelper } from "../context/ToastContext";

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
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

function SectionCard({
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

const GRADE_BUCKETS = [
  { label: "Below 75", min: Number.NEGATIVE_INFINITY, max: 74 },
  { label: "75-79", min: 75, max: 79 },
  { label: "80-84", min: 80, max: 84 },
  { label: "85-89", min: 85, max: 89 },
  { label: "90-94", min: 90, max: 94 },
  { label: "95+", min: 95, max: Number.POSITIVE_INFINITY },
] as const;

// Local type definitions
interface TeacherClass {
  id: number;
  name: string;
  section: string;
  school_year?: string;
  school_level?: string;
}

interface Student {
  id: number;
  student_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  sex?: string;
  lrn?: string;
}

interface StudentGrade {
  id: number;
  grade: number;
  subject_id: number;
  quarter: string;
}

interface StudentPerformance {
  student: Student;
  gradeValue: number | null;
}

export default function TeacherDashboard() {
  const userCtx = useContext(UserContext);
  const user = userCtx?.user ?? null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // teacherId removed — not used elsewhere; resolvedTeacherId used locally
  const [advisoryClass, setAdvisoryClass] = useState<TeacherClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentGrades, setStudentGrades] = useState<
    Record<number, StudentGrade[]>
  >({});
  const [selectedQuarter, setSelectedQuarter] = useState<
    "all" | "1" | "2" | "3"
  >("all");

  // PDF generation states
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set(),
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const toast = useToastHelper();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);

        let resolvedTeacherId = user.id;

        if (user.role === "teacher") {
          const teacherResponse = await axios.get(
            `http://localhost:7000/teachers/email/${encodeURIComponent(user.email)}`,
            { withCredentials: true },
          );
          resolvedTeacherId = teacherResponse.data?.data?.id ?? user.id;
        }

        // resolvedTeacherId available locally if needed

        const classResponse = await axios.get(
          `http://localhost:7000/class-teachers/teacher/${resolvedTeacherId}?limit=1000`,
          { withCredentials: true },
        );

        const advisory = classResponse.data?.data?.[0] ?? null;
        setAdvisoryClass(advisory);

        if (!advisory) {
          setStudents([]);
          setStudentGrades({});
          return;
        }

        const studentsResponse = await axios.get(
          `http://localhost:7000/class-students/class/${advisory.id}?limit=1000`,
          { withCredentials: true },
        );

        const advisoryStudents: Student[] = studentsResponse.data?.data || [];
        setStudents(advisoryStudents);

        const gradeResponses = await Promise.all(
          advisoryStudents.map((student: Student) =>
            axios.get(
              `http://localhost:7000/grades/student/${student.student_id}`,
              {
                withCredentials: true,
              },
            ),
          ),
        );

        const gradesMap = advisoryStudents.reduce<
          Record<number, StudentGrade[]>
        >((acc, student, index) => {
          acc[student.id] = gradeResponses[index]?.data?.data || [];
          return acc;
        }, {});

        setStudentGrades(gradesMap);
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

    loadDashboard();
  }, [user?.id, user?.email, user?.role]);

  const studentPerformance = useMemo<StudentPerformance[]>(() => {
    return students.map((student) => {
      const grades = studentGrades[student.id] || [];
      const validGrades = grades.filter((grade) =>
        selectedQuarter === "all" ? true : grade.quarter === selectedQuarter,
      );

      if (validGrades.length === 0) {
        return { student, gradeValue: null };
      }

      const average =
        validGrades.reduce((sum, grade) => sum + grade.grade, 0) /
        validGrades.length;

      return { student, gradeValue: average };
    });
  }, [students, studentGrades, selectedQuarter]);

  const totalStudents = students.length;
  const maleCount = students.filter((student) =>
    (student.sex || "").toLowerCase().includes("male"),
  ).length;
  const femaleCount = students.filter((student) =>
    (student.sex || "").toLowerCase().includes("female"),
  ).length;

  const gradeDistribution = useMemo(() => {
    const counts = GRADE_BUCKETS.map((bucket) => ({
      label: bucket.label,
      count: 0,
    }));

    studentPerformance.forEach((entry) => {
      if (entry.gradeValue === null) {
        return;
      }

      const bucketIndex = GRADE_BUCKETS.findIndex(
        (bucket) =>
          entry.gradeValue! >= bucket.min && entry.gradeValue! <= bucket.max,
      );

      if (bucketIndex >= 0) {
        counts[bucketIndex].count += 1;
      }
    });

    return counts;
  }, [studentPerformance]);

  if (loading) {
    return (
      <article className="p-8 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-slate-600 font-medium">
            Loading dashboard...
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome, {user?.username || "Teacher"}
          </h1>
          <p className="text-lg text-slate-600">
            Advisory class summary and grade distribution.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/teacher/my-classes"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            My Classes
          </Link>
          <Link
            to="/grade-management"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Grade Management
          </Link>
          {/* Generate report moved to sidebar Class Reports page */}
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:col-span-2 xl:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Advisory Class
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {advisoryClass ? advisoryClass.name : "No advisory class"}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-6">
                {advisoryClass
                  ? `${advisoryClass.section} • ${advisoryClass.school_year || ""}`
                  : "No advisory class found for this account."}
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
              <FaSchool className="text-xl" />
            </div>
          </div>
        </div>

        <MetricCard
          label="Total Students"
          value={totalStudents}
          tone="bg-indigo-50 text-indigo-700"
          icon={<FaUsers className="text-xl" />}
        />

        <MetricCard
          label="Male Students"
          value={maleCount}
          tone="bg-sky-50 text-sky-700"
          icon={<FaUsers className="text-xl" />}
        />

        <MetricCard
          label="Female Students"
          value={femaleCount}
          tone="bg-pink-50 text-pink-700"
          icon={<FaUsers className="text-xl" />}
        />
      </div>

      <SectionCard
        title="Grade Distribution"
        description="Based on average grade per student across all quarters in the advisory class."
      >
        <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
          {gradeDistribution.map((bucket) => (
            <div
              key={bucket.label}
              className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Grade Band
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {bucket.label}
                  </h3>
                </div>
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <FaChartBar className="text-base" />
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="text-4xl font-semibold tracking-tight text-slate-900">
                  {bucket.count}
                </div>
                <p className="text-sm text-slate-500">students</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/80 p-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Advisory Class Student List
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Quarter filter only affects this student list.
            </p>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Quarter Filter
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) =>
                setSelectedQuarter(e.target.value as "all" | "1" | "2" | "3")
              }
              className="w-full border border-slate-300 px-4 py-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Quarters</option>
              <option value="1">Quarter 1</option>
              <option value="2">Quarter 2</option>
              <option value="3">Quarter 3</option>
            </select>
          </div>
        </div>

        {studentPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Sex
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Average Grade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentPerformance.map(({ student, gradeValue }) => {
                  const status =
                    gradeValue === null
                      ? "No Grade"
                      : gradeValue < 75
                        ? "Below 75"
                        : gradeValue < 80
                          ? "75-79"
                          : gradeValue < 85
                            ? "80-84"
                            : gradeValue < 90
                              ? "85-89"
                              : gradeValue < 95
                                ? "90-94"
                                : "95+";

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            Student ID: {student.student_id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {student.sex || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-semibold">
                        {gradeValue === null ? "-" : gradeValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            <p className="font-medium">
              No students found in this advisory class
            </p>
          </div>
        )}
      </section>

      {/* PDF Selection Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Select Students for PDF Generation
              </h2>
              <button
                onClick={() => setShowPdfModal(false)}
                disabled={isGeneratingPdf}
                className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body - Student List */}
            <div className="p-6 space-y-2">
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() =>
                    setSelectedStudentIds(
                      new Set(students.map((s) => s.student_id)),
                    )
                  }
                  className="text-sm px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedStudentIds(new Set())}
                  className="text-sm px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                >
                  Deselect All
                </button>
              </div>

              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => {
                    const newSet = new Set(selectedStudentIds);
                    if (newSet.has(student.student_id)) {
                      newSet.delete(student.student_id);
                    } else {
                      newSet.add(student.student_id);
                    }
                    setSelectedStudentIds(newSet);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.has(student.student_id)}
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      ID: {student.student_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPdfModal(false)}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (selectedStudentIds.size === 0) {
                    toast.warning("Please select at least one student");
                    return;
                  }

                  try {
                    setIsGeneratingPdf(true);
                    toast.info(
                      `Generating PDFs for ${selectedStudentIds.size} student(s)...`,
                    );

                    const resp = await axios.post(
                      `http://localhost:7000/classes/${advisoryClass?.id}/generate-pdfs`,
                      { studentIds: Array.from(selectedStudentIds) },
                      { withCredentials: true, responseType: "blob" },
                    );

                    const blob = new Blob([resp.data], {
                      type: "application/zip",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `class_${advisoryClass?.id}_${selectedStudentIds.size}_students_grades.zip`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);

                    toast.success(
                      `Successfully generated ${selectedStudentIds.size} PDF(s)`,
                    );
                    setShowPdfModal(false);
                  } catch (err) {
                    console.error(err);
                    toast.error(
                      "Failed to generate PDFs. See console for details.",
                    );
                  } finally {
                    setIsGeneratingPdf(false);
                  }
                }}
                disabled={isGeneratingPdf || selectedStudentIds.size === 0}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingPdf ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaDownload size={16} />
                    Download ({selectedStudentIds.size})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
