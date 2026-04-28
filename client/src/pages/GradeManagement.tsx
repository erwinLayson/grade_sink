import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { useToastHelper } from "../context/ToastContext";

interface ClassStudent {
  id: number;
  student_id: number;
  class_id: number;
  first_name: string;
  last_name: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface TeacherClass {
  id: number;
  name: string;
  section: string;
}

export default function GradeManagement() {
  const context = useContext(UserContext);
  const user = context?.user;
  const toast = useToastHelper();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, subjectRes] = await Promise.all([
        axios.get(
          `http://localhost:7000/class-teachers/teacher/${user?.id}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
        axios.get(
          `http://localhost:7000/teacher-subjects/teacher/${user?.id}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
      ]);
      setClasses(classRes.data?.data || []);
      setSubjects(subjectRes.data?.data || []);
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

  const fetchClassStudents = async (classId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/class-students/class/${classId}?limit=1000`,
        { withCredentials: true },
      );
      setClassStudents(response.data?.data || []);
      setGrades({});
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  };

  async function handleSubmitGrades(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedClass || !selectedQuarter || !selectedSubject) {
      toast.warning("Please select class, quarter, and subject");
      return;
    }

    if (Object.keys(grades).length === 0) {
      toast.warning("Please enter at least one grade");
      return;
    }

    setSubmitting(true);
    try {
      const gradeEntries = Object.entries(grades).map(([studentId, grade]) => ({
        student_id: parseInt(studentId),
        subject_id: parseInt(selectedSubject),
        teacher_id: user?.id,
        grade: parseInt(grade.toString()),
        quarter: parseInt(selectedQuarter),
      }));

      await Promise.all(
        gradeEntries.map((gradeEntry) =>
          axios.post("http://localhost:7000/grades", gradeEntry, {
            withCredentials: true,
          }),
        ),
      );

      toast.success("Grades submitted successfully");
      setGrades({});
      setSelectedClass("");
      setSelectedQuarter("");
      setSelectedSubject("");
      setClassStudents([]);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Grade Management
        </h1>
        <p className="text-lg text-slate-600">
          Input and manage student grades
        </p>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmitGrades} className="space-y-6">
        {/* Selection Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Class <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                if (e.target.value) {
                  fetchClassStudents(e.target.value);
                }
              }}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>
          </div>

          {/* Quarter Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Quarter <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select quarter</option>
              <option value="1">Quarter 1</option>
              <option value="2">Quarter 2</option>
              <option value="3">Quarter 3</option>
              <option value="4">Quarter 4</option>
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Subject <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grades Input Section */}
        {selectedClass && classStudents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Enter Grades
            </h2>
            <div className="space-y-4">
              {classStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Student ID: {student.student_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={grades[student.id] || ""}
                      onChange={(e) =>
                        setGrades({
                          ...grades,
                          [student.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24 border border-slate-300 px-3 py-2 rounded-lg text-slate-900 text-center placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <span className="text-slate-500 font-medium min-w-max">
                      / 100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {selectedClass && classStudents.length > 0 && (
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:active:scale-100"
          >
            {submitting ? "Submitting..." : "Submit Grades"}
          </button>
        )}
      </form>
    </article>
  );
}
