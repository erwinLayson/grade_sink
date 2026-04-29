import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { useToastHelper } from "../context/ToastContext";
import { FaSchool } from "react-icons/fa";

interface ClassStudent {
  id: number;
  student_id: number;
  class_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  sex?: string;
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
  school_year?: string;
  school_level?: string;
}

interface TeacherClassSubject {
  id: number;
  class_id: number;
  subject_id: number;
  code: string;
  name: string;
  teacher_id?: number | null;
  teacher_name?: string | null;
}

interface ExistingGrade {
  id: number;
  grade: number;
  subject_id: number;
  quarter: string;
}

export default function GradeManagement() {
  const context = useContext(UserContext);
  const user = context?.user;
  const toast = useToastHelper();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClassSubjects, setSelectedClassSubjects] = useState<
    TeacherClassSubject[]
  >([]);
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [existingGrades, setExistingGrades] = useState<
    Record<number, ExistingGrade>
  >({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [savingEditStudentId, setSavingEditStudentId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<{ [key: number]: number }>({});
  const [teacherId, setTeacherId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchTeacherIdAndData();
    }
  }, [user?.id]);

  const fetchTeacherIdAndData = async () => {
    try {
      if (user?.role === "teacher") {
        const response = await axios.get(
          `http://localhost:7000/teachers/email/${encodeURIComponent(user.email)}`,
          { withCredentials: true },
        );
        const resolvedTeacherId = response.data?.data?.id ?? user.id;
        setTeacherId(resolvedTeacherId);
        await fetchData(resolvedTeacherId);
        return;
      }

      setTeacherId(user?.id ?? null);
      await fetchData(user?.id);
    } catch (e) {
      const fallbackTeacherId = user?.id ?? null;
      setTeacherId(fallbackTeacherId);
      await fetchData(fallbackTeacherId ?? undefined);
    }
  };

  const fetchData = async (resolvedTeacherId?: number) => {
    try {
      setLoading(true);
      const id = resolvedTeacherId ?? teacherId ?? user?.id;

      const [classRes, subjectRes, assignedClassRes] = await Promise.all([
        axios.get(
          `http://localhost:7000/class-teachers/teacher/${id}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
        axios.get(
          `http://localhost:7000/teacher-subjects/teacher/${id}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
        axios.get(
          `http://localhost:7000/class-subjects/teacher/${id}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
      ]);

      const advisoryClasses = classRes.data?.data || [];
      const subjectClasses = assignedClassRes.data?.data || [];
      const mergedClasses = [...advisoryClasses, ...subjectClasses].reduce<
        TeacherClass[]
      >((acc, current) => {
        if (!acc.some((item) => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setClasses(mergedClasses);
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
      const [studentsResponse, classSubjectsResponse] = await Promise.all([
        axios.get(
          `http://localhost:7000/class-students/class/${classId}?limit=1000`,
          { withCredentials: true },
        ),
        axios.get(
          `http://localhost:7000/class-subjects/class/${classId}?limit=1000`,
          { withCredentials: true },
        ),
      ]);

      setClassStudents(studentsResponse.data?.data || []);
      setGrades({});
      setExistingGrades({});
      setEditingStudentId(null);
      setSavingEditStudentId(null);

      const classSubjectsForClass = classSubjectsResponse.data?.data || [];
      setSelectedClassSubjects(classSubjectsForClass);

      if (classSubjectsForClass.length > 0) {
        const firstSubjectId = classSubjectsForClass[0]?.subject_id;
        setSelectedSubject(firstSubjectId ? firstSubjectId.toString() : "");
      } else {
        setSelectedSubject("");
      }
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  };

  const loadExistingGrades = async () => {
    if (
      !selectedClass ||
      !selectedSubject ||
      !selectedQuarter ||
      classStudents.length === 0
    ) {
      setExistingGrades({});
      setEditingStudentId(null);
      setSavingEditStudentId(null);
      return;
    }

    try {
      const responses = await Promise.all(
        classStudents.map((student) =>
          axios.get(`http://localhost:7000/grades/student/${student.id}`, {
            withCredentials: true,
          }),
        ),
      );

      const nextExistingGrades = classStudents.reduce<
        Record<number, ExistingGrade>
      >((acc, student, index) => {
        const studentGrades = responses[index]?.data?.data || [];
        const matchingGrades = studentGrades.filter(
          (grade: ExistingGrade) =>
            grade.subject_id === parseInt(selectedSubject) &&
            grade.quarter === selectedQuarter,
        );

        if (matchingGrades.length > 0) {
          acc[student.id] = matchingGrades[matchingGrades.length - 1];
        }

        return acc;
      }, {});

      setExistingGrades(nextExistingGrades);
      setEditingStudentId(null);
      setSavingEditStudentId(null);
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

    const blockedStudent = classStudents.find(
      (student) =>
        existingGrades[student.id] && grades[student.id] !== undefined,
    );

    if (blockedStudent) {
      toast.warning(
        `Grade already exists for ${blockedStudent.first_name} ${blockedStudent.last_name}. Use Edit instead.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const gradeEntries = classStudents
        .filter(
          (student) =>
            !existingGrades[student.id] && grades[student.id] !== undefined,
        )
        .map((student) => ({
          student_id: student.id,
          subject_id: parseInt(selectedSubject),
          teacher_id: teacherId ?? user?.id,
          grade: parseInt(grades[student.id].toString()),
          quarter: selectedQuarter,
        }));

      if (gradeEntries.length === 0) {
        toast.warning("Please enter at least one new grade");
        return;
      }

      await Promise.all(
        gradeEntries.map((gradeEntry) =>
          axios.post("http://localhost:7000/grades", gradeEntry, {
            withCredentials: true,
          }),
        ),
      );

      toast.success("Grades submitted successfully");
      setGrades({});
      await loadExistingGrades();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedClassData = useMemo(
    () => classes.find((cls) => cls.id.toString() === selectedClass) || null,
    [classes, selectedClass],
  );

  const availableSubjects = useMemo(() => {
    if (!selectedClass) {
      return subjects;
    }

    if (selectedClassSubjects.length === 0) {
      return subjects;
    }

    const allowedSubjectIds = new Set(
      selectedClassSubjects.map((item) => item.subject_id),
    );
    return subjects.filter((subject) => allowedSubjectIds.has(subject.id));
  }, [subjects, selectedClass, selectedClassSubjects]);

  useEffect(() => {
    if (
      selectedClass &&
      selectedSubject &&
      selectedQuarter &&
      classStudents.length > 0
    ) {
      loadExistingGrades();
      return;
    }

    setExistingGrades({});
    setEditingStudentId(null);
    setSavingEditStudentId(null);
  }, [selectedClass, selectedSubject, selectedQuarter, classStudents]);

  const handleStartEdit = (studentId: number) => {
    const existingGrade = existingGrades[studentId];

    if (!existingGrade) {
      return;
    }

    setEditingStudentId(studentId);
    setGrades((currentGrades) => ({
      ...currentGrades,
      [studentId]: existingGrade.grade,
    }));
  };

  const handleCancelEdit = (studentId: number) => {
    setEditingStudentId(null);
    setGrades((currentGrades) => {
      const nextGrades = { ...currentGrades };
      delete nextGrades[studentId];
      return nextGrades;
    });
  };

  const handleSaveEdit = async (studentId: number) => {
    const existingGrade = existingGrades[studentId];

    if (!existingGrade) {
      toast.warning("No existing grade found to edit");
      return;
    }

    const nextGradeValue = grades[studentId];

    if (nextGradeValue === undefined || Number.isNaN(nextGradeValue)) {
      toast.warning("Please enter a valid grade");
      return;
    }

    setSavingEditStudentId(studentId);

    try {
      await axios.put(
        `http://localhost:7000/grades/${existingGrade.id}`,
        { grade: nextGradeValue },
        { withCredentials: true },
      );

      toast.success("Grade updated successfully");
      setEditingStudentId(null);
      await loadExistingGrades();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    } finally {
      setSavingEditStudentId(null);
    }
  };

  const renderClassCard = (cls: TeacherClass) => {
    const isSelected = selectedClass === cls.id.toString();

    return (
      <button
        type="button"
        key={cls.id}
        onClick={() => {
          setSelectedClass(cls.id.toString());
          setSelectedClassName(cls.name);
          setSelectedQuarter("");
          setSelectedSubject("");
          fetchClassStudents(cls.id.toString());
        }}
        className={`text-left rounded-[22px] border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Class
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              {cls.name}
            </h3>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <FaSchool className="text-lg" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {cls.school_level || "Class"}
          </span>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {cls.section}
          </span>
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
              {cls.school_year || "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Level
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {cls.school_level || "-"}
            </p>
          </div>
        </div>
      </button>
    );
  };

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
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Grade Management
          </h1>
          <p className="text-lg text-slate-600">
            Input and manage student grades
          </p>
        </div>

        {selectedClass && (
          <button
            type="button"
            onClick={() => {
              setSelectedClass("");
              setSelectedClassName("");
              setSelectedQuarter("");
              setSelectedSubject("");
              setClassStudents([]);
              setSelectedClassSubjects([]);
              setGrades({});
              setExistingGrades({});
              setEditingStudentId(null);
              setSavingEditStudentId(null);
            }}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Back to Classes
          </button>
        )}
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!selectedClass ? (
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Select a Class
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Advisory classes and classes where your subjects are assigned.
            </p>
          </div>
          {classes.length > 0 ? (
            <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {classes.map((cls) => renderClassCard(cls))}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">
              <p className="font-medium">No classes assigned</p>
            </div>
          )}
        </section>
      ) : (
        <form onSubmit={handleSubmitGrades} className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/80 p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedClassName || selectedClassData?.name} -{" "}
                {selectedClassData?.section}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Students appear below. Choose a quarter first to enable grading.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
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
                </select>
              </div>

              <div className="md:col-span-2">
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
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Students
              </h3>

              {classStudents.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full bg-white">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Sex
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Grade
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {classStudents.map((student) => {
                        const gradingDisabled = !selectedQuarter;
                        const existingGrade = existingGrades[student.id];
                        const isEditing = editingStudentId === student.id;

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
                                {student.middle_name && (
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {student.middle_name}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {student.student_id}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {student.sex || "-"}
                            </td>
                            <td className="px-6 py-4">
                              {existingGrade && !isEditing ? (
                                <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                                  {existingGrade.grade}
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder={
                                      gradingDisabled
                                        ? "Select quarter first"
                                        : "0-100"
                                    }
                                    value={grades[student.id] || ""}
                                    disabled={gradingDisabled}
                                    onChange={(e) =>
                                      setGrades({
                                        ...grades,
                                        [student.id]:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="w-28 border border-slate-300 px-3 py-2 rounded-lg text-slate-900 text-center placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                                  />
                                  <span className="text-slate-500 font-medium min-w-max">
                                    / 100
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {existingGrade ? (
                                isEditing ? (
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      disabled={
                                        savingEditStudentId === student.id
                                      }
                                      onClick={() => handleSaveEdit(student.id)}
                                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-400"
                                    >
                                      {savingEditStudentId === student.id
                                        ? "Saving..."
                                        : "Save"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCancelEdit(student.id)
                                      }
                                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(student.id)}
                                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                  >
                                    Edit
                                  </button>
                                )
                              ) : (
                                <span className="text-sm font-medium text-slate-400">
                                  New
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  <p className="font-medium">No students found in this class</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-6">
              <button
                type="submit"
                disabled={
                  submitting || !selectedQuarter || classStudents.length === 0
                }
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:active:scale-100"
              >
                {submitting ? "Submitting..." : "Submit Grades"}
              </button>
            </div>
          </div>
        </form>
      )}
    </article>
  );
}
