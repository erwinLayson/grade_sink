import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import { useToast, useToastHelper } from "../../context/ToastContext";

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

interface SubjectWithTeacherCount extends Subject {
  teacher_count?: number;
  class_count?: number;
}

interface SubjectTeacher {
  id: number;
  teacher_id: number;
  subject_id: number;
  teacher_name: string;
}

interface SubjectFormData {
  code: string;
  name: string;
}

export default function ManageSubjects() {
  // Main states
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState<SubjectWithTeacherCount[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail view state
  const [selectedSubjectDetail, setSelectedSubjectDetail] =
    useState<Subject | null>(null);
  const [subjectTeachers, setSubjectTeachers] = useState<SubjectTeacher[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<
    "create" | "update" | "addTeacher" | ""
  >("");

  // Create/Update subject form
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);

  // Add teacher form
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const toast = useToastHelper();
  const { addToast } = useToast();

  const totalSubjects = subjects.length;
  const totalTeachers = teachers.length;
  const activeSubjects = subjects.filter(
    (subject) => (subject.teacher_count || 0) > 0,
  ).length;
  const totalAssignments = subjects.reduce(
    (sum, subject) => sum + (subject.teacher_count || 0),
    0,
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectRes, teacherRes, teacherSubjectRes, classSubjectRes] =
        await Promise.all([
          axios.get("http://localhost:7000/subjects?limit=1000", {
            withCredentials: true,
          }),
          axios.get("http://localhost:7000/teachers?limit=1000", {
            withCredentials: true,
          }),
          axios.get("http://localhost:7000/teacher-subjects?limit=1000", {
            withCredentials: true,
          }),
          axios.get("http://localhost:7000/class-subjects?limit=1000", {
            withCredentials: true,
          }),
        ]);

      const allTeachers = teacherRes.data?.data || [];
      const allTeacherSubjects = teacherSubjectRes.data?.data || [];
      const allClassSubjects = classSubjectRes.data?.data || [];

      // Count teachers per subject
      const subjectsWithCount = (subjectRes.data?.data || []).map(
        (subject: Subject) => ({
          ...subject,
          teacher_count: allTeacherSubjects.filter(
            (ts: any) => ts.subject_id === subject.id,
          ).length,
          class_count: allClassSubjects.filter(
            (cs: any) => cs.subject_id === subject.id,
          ).length,
        }),
      );

      setSubjects(subjectsWithCount);
      setTeachers(allTeachers);
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

  const fetchSubjectTeachers = async (subjectId: number) => {
    try {
      setDetailLoading(true);
      const response = await axios.get(
        `http://localhost:7000/teacher-subjects?limit=1000`,
        {
          withCredentials: true,
        },
      );

      const allTeacherSubjects = response.data?.data || [];
      const subjectTeacherAssignments = allTeacherSubjects
        .filter((ts: any) => ts.subject_id === subjectId)
        .map((ts: any) => {
          const teacher = teachers.find((t) => t.id === ts.teacher_id);
          return {
            id: ts.id,
            teacher_id: ts.teacher_id,
            subject_id: ts.subject_id,
            teacher_name: teacher
              ? `${teacher.first_name} ${teacher.last_name}`
              : "Unknown",
          };
        });

      setSubjectTeachers(subjectTeacherAssignments);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleOpenDetail(subject: SubjectWithTeacherCount) {
    setSelectedSubjectDetail(subject);
    setCode(subject.code);
    setName(subject.name);
    fetchSubjectTeachers(subject.id);
  }

  function handleCloseDetail() {
    setSelectedSubjectDetail(null);
    setCode("");
    setName("");
    setSubjectTeachers([]);
  }

  function handleCreateSubject() {
    setModalType("create");
    setOpenModal(true);
    setCode("");
    setName("");
    setSelectedTeachers([]);
    setSelectedSubject(null);
  }

  function handleUpdateSubject(subject: Subject) {
    setSelectedSubject(subject);
    setCode(subject.code);
    setName(subject.name);
    setSelectedTeachers([]);
    setModalType("update");
    setOpenModal(true);
  }

  function toggleTeacherSelection(teacherId: number) {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId],
    );
  }

  async function handleSubjectModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!code || !name) {
      toast.warning("Code and Name are required");
      return;
    }

    const subjectData: SubjectFormData = { code, name };

    try {
      let createdSubjectId: number;

      if (modalType === "create") {
        const response = await axios.post(
          "http://localhost:7000/subjects",
          subjectData,
          {
            withCredentials: true,
          },
        );
        createdSubjectId = response.data?.data?.id;
        toast.success("Subject created successfully");
      } else {
        await axios.put(
          `http://localhost:7000/subjects/${selectedSubject?.id}`,
          subjectData,
          {
            withCredentials: true,
          },
        );
        toast.success("Subject updated successfully");
        await fetchData();
        handleCloseModal();
        return;
      }

      // If create mode and teachers selected, assign them
      if (modalType === "create" && selectedTeachers.length > 0) {
        for (const teacherId of selectedTeachers) {
          await axios.post(
            "http://localhost:7000/teacher-subjects",
            {
              teacher_id: teacherId,
              subject_id: createdSubjectId,
            },
            {
              withCredentials: true,
            },
          );
        }
      }

      await fetchData();
      handleCloseModal();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  async function handleAddTeacher(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedTeacher) {
      toast.warning("Please select a teacher");
      return;
    }

    try {
      await axios.post(
        "http://localhost:7000/teacher-subjects",
        {
          teacher_id: parseInt(selectedTeacher),
          subject_id: selectedSubjectDetail?.id,
        },
        { withCredentials: true },
      );

      toast.success("Teacher added successfully");
      setSelectedTeacher("");
      await fetchSubjectTeachers(selectedSubjectDetail!.id);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  async function handleDeleteSubject(id: number) {
    addToast({
      type: "error",
      message: "Delete this subject?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(`http://localhost:7000/subjects/${id}`, {
              withCredentials: true,
            });
            toast.success("Subject deleted successfully");
            await fetchData();
          } catch (e) {
            const errorMsg = axios.isAxiosError(e)
              ? e.response?.data?.msg || e.message
              : String(e);
            toast.error(errorMsg);
          }
        },
      },
    });
  }

  async function handleDeleteTeacher(teacherSubjectId: number) {
    addToast({
      type: "error",
      message: "Remove this teacher?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(
              `http://localhost:7000/teacher-subjects/${teacherSubjectId}`,
              {
                withCredentials: true,
              },
            );
            toast.success("Teacher removed successfully");
            await fetchSubjectTeachers(selectedSubjectDetail!.id);
            await fetchData(); // Update teacher count on cards
          } catch (e) {
            const errorMsg = axios.isAxiosError(e)
              ? e.response?.data?.msg || e.message
              : String(e);
            toast.error(errorMsg);
          }
        },
      },
    });
  }

  async function handleUpdateSubjectFromDetail(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!code || !name) {
      toast.warning("Code and Name are required");
      return;
    }

    const subjectData: SubjectFormData = { code, name };

    try {
      await axios.put(
        `http://localhost:7000/subjects/${selectedSubjectDetail?.id}`,
        subjectData,
        {
          withCredentials: true,
        },
      );

      toast.success("Subject updated successfully");
      await fetchData();
      handleCloseDetail();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  function handleCloseModal() {
    setOpenModal(false);
    setModalType("");
    setCode("");
    setName("");
    setSelectedSubject(null);
    setSelectedTeachers([]);
    setSelectedTeacher("");
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
            <p className="text-lg font-semibold text-slate-900">
              Loading subjects...
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Preparing subject records and teacher assignments.
            </p>
          </div>
        </div>
      </div>
    );

  if (selectedSubjectDetail) {
    return (
      <article className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-100/70 to-transparent" />
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />
        {/* Modal for adding teacher */}
        <div
          className={`fixed ${
            openModal ? "block opacity-100" : "hidden opacity-0"
          } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-950/50 px-4 transition-all backdrop-blur-sm`}
        >
          <form
            onSubmit={handleAddTeacher}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-rose-50 px-6 py-5">
              <div className="grid place-items-center text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                  Add Teacher
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Connect a teacher to this subject without leaving the page.
                </p>
              </div>
              <span
                className="absolute right-4 top-4 cursor-pointer rounded-full border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                onClick={() => {
                  setOpenModal(false);
                  setSelectedTeacher("");
                }}
              >
                <FaTimes className="text-sm" />
              </span>
            </div>

            <article className="space-y-4 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Teacher *
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers
                    .filter(
                      (t) =>
                        !subjectTeachers.some((st) => st.teacher_id === t.id),
                    )
                    .map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
              >
                Add Teacher
              </button>
            </article>
          </form>
        </div>

        {/* Back button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCloseDetail}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
          >
            <FaArrowLeft /> Back to Subjects
          </button>
        </div>

        {/* Detail View - Horizontal Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Side - Subject Details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Subject Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Edit the code and name while keeping assigned teachers intact.
              </p>
            </div>
            <form onSubmit={handleUpdateSubjectFromDetail}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ENG101"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., English Literature"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Teachers List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Assigned Teachers
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current teacher links for this subject.
                </p>
              </div>
              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <FaPlus /> Add Teacher
              </button>
            </div>

            {detailLoading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-slate-500">
                Loading...
              </div>
            ) : subjectTeachers.length > 0 ? (
              <div className="space-y-3">
                {subjectTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-violet-200 hover:bg-violet-50"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {teacher.teacher_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="text-rose-600 transition hover:text-rose-800"
                      title="Remove teacher"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500">
                <p>No teachers assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-100/70 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />
      {/* Modal for create/update subject */}
      <div
        className={`fixed ${
          openModal ? "block opacity-100" : "hidden opacity-0"
        } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-950/50 px-4 transition-all overflow-y-auto backdrop-blur-sm`}
      >
        <form
          onSubmit={handleSubjectModalSubmit}
          className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] my-8"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-rose-50 px-6 py-5">
            <div className="grid place-items-center text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                {modalType === "create"
                  ? "Create Subject with Teachers"
                  : "Update Subject"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Keep the subject catalog organized and easy to maintain.
              </p>
            </div>
            <span
              className="absolute right-4 top-4 cursor-pointer rounded-full border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
              onClick={handleCloseModal}
            >
              <FaTimes className="text-sm" />
            </span>
          </div>

          <article className="space-y-4 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Subject Code *
              </label>
              <input
                type="text"
                placeholder="e.g., ENG101"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Subject Name *
              </label>
              <input
                type="text"
                placeholder="e.g., English Literature"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {modalType === "create" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assign Teachers (Optional)
                </label>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <label
                        key={teacher.id}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => toggleTeacherSelection(teacher.id)}
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-slate-700">
                          {teacher.first_name} {teacher.last_name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No teachers available
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`mt-2 w-full rounded-xl px-4 py-3 font-semibold text-white transition ${
                modalType === "create"
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {modalType === "create" ? "Create Subject" : "Update Subject"}
            </button>
          </article>
        </form>
      </div>

      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-rose-50 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
                Subject Management
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Manage Subjects
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Keep every subject organized, assign teachers, and review
                teaching coverage in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:min-w-[520px]">
              <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Subjects
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalSubjects}
                </p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Teachers
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalTeachers}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Active
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {activeSubjects}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Assignments
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalAssignments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg mb-6">
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <button
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            onClick={handleCreateSubject}
          >
            <FaPlus /> Create Subject
          </button>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-300" />
            {/* Card clickable area */}
            <div
              onClick={() => handleOpenDetail(subject)}
              className="cursor-pointer p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                    Subject
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    {subject.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                    {subject.code}
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Coverage
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {subject.teacher_count || 0} Teachers
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm">
                  <p className="text-3xl font-bold leading-none text-violet-700">
                    {subject.teacher_count || 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Teachers
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                  <p className="text-3xl font-bold leading-none text-amber-700">
                    {subject.class_count || 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Classes
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Tap to view details
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                Active
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 px-6 pb-5 pt-1 opacity-0 translate-y-1 pointer-events-none transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={() => handleUpdateSubject(subject)}
                className="inline-flex items-center justify-center rounded-xl border border-violet-100 bg-violet-50 p-2.5 text-violet-700 transition hover:bg-violet-100"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="inline-flex items-center justify-center rounded-xl border border-rose-100 bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-slate-500">No subjects found</p>
        </div>
      )}
    </article>
  );
}
