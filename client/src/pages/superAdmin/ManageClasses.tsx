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

interface Class {
  id: number;
  name: string;
  section: string;
  school_year: string;
  school_level: string;
  teacher_id: number | null;
}

interface ClassWithDetails extends Class {
  adviser_name?: string;
  student_count?: number;
  subject_count?: number;
}

interface Student {
  id: number;
  student_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  sex: string;
  level: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface ClassStudent {
  id: number;
  student_id: number;
  class_id: number;
  first_name: string;
  last_name: string;
  sex: string;
}

interface ClassSubject {
  id: number;
  class_id: number;
  subject_id: number;
  code: string;
  name: string;
  teacher_id: number;
  teacher_name: string;
}

interface ClassFormData {
  name: string;
  section: string;
  school_year: string;
  school_level: string;
  teacher_id?: number | null;
}

export default function ManageClasses() {
  // Main states
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState<ClassWithDetails[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Class detail view state
  const [selectedClassDetail, setSelectedClassDetail] = useState<Class | null>(
    null,
  );
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([]);
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<
    | "create"
    | "update"
    | "addStudent"
    | "addSubject"
    | "editSubjectTeacher"
    | ""
  >("");

  // Create/Update class form
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [school_year, setSchoolYear] = useState("");
  const [school_level, setSchoolLevel] = useState("");
  const [teacher_id, setTeacherId] = useState("");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Add student form
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  // Add subject form
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectTeachers, setSubjectTeachers] = useState<any[]>([]);
  const [selectedSubjectTeacher, setSelectedSubjectTeacher] = useState("");

  // Edit subject teacher form
  const [editingSubject, setEditingSubject] = useState<ClassSubject | null>(
    null,
  );
  const [editTeacherId, setEditTeacherId] = useState("");
  const [availableTeachersForSubject, setAvailableTeachersForSubject] =
    useState<any[]>([]);

  const toast = useToastHelper();
  const { addToast } = useToast();

  const totalClasses = classes.length;
  const totalTeachers = teachers.length;
  const assignedClasses = classes.filter((cls) => cls.teacher_id).length;
  const totalStudents = classes.reduce(
    (sum, cls) => sum + (cls.student_count || 0),
    0,
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        classRes,
        teacherRes,
        studentRes,
        subjectRes,
        classStudentRes,
        classSubjectRes,
      ] = await Promise.all([
        axios.get("http://localhost:7000/classes?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/teachers?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/students?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/subjects?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/class-students?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/class-subjects?limit=1000", {
          withCredentials: true,
        }),
      ]);

      const allTeachers = teacherRes.data?.data || [];
      const teacherNameMap = new Map<number, string>(
        allTeachers.map((teacher: any) => [
          teacher.id,
          `${teacher.first_name} ${teacher.last_name}`,
        ]),
      );

      const classStudentCounts = (classStudentRes.data?.data || []).reduce(
        (acc: Record<number, number>, cs: any) => {
          if (cs.class_id) {
            acc[cs.class_id] = (acc[cs.class_id] || 0) + 1;
          }
          return acc;
        },
        {},
      );

      const classSubjectCounts = (classSubjectRes.data?.data || []).reduce(
        (acc: Record<number, number>, cs: any) => {
          if (cs.class_id) {
            acc[cs.class_id] = (acc[cs.class_id] || 0) + 1;
          }
          return acc;
        },
        {},
      );

      const allClasses = (classRes.data?.data || []).map((cls: Class) => ({
        ...cls,
        adviser_name: cls.teacher_id
          ? teacherNameMap.get(cls.teacher_id) || "Unassigned"
          : "Unassigned",
        student_count: classStudentCounts[cls.id] || 0,
        subject_count: classSubjectCounts[cls.id] || 0,
      }));

      setClasses(allClasses);
      setTeachers(allTeachers);
      setAvailableStudents(studentRes.data?.data || []);
      setAvailableSubjects(subjectRes.data?.data || []);
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

  const fetchClassDetails = async (classId: number) => {
    try {
      setDetailLoading(true);
      const [studentsRes, subjectsRes] = await Promise.all([
        axios.get(
          `http://localhost:7000/class-students/class/${classId}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
        axios.get(
          `http://localhost:7000/class-subjects/class/${classId}?limit=1000`,
          {
            withCredentials: true,
          },
        ),
      ]);

      setClassStudents(studentsRes.data?.data || []);
      setClassSubjects(subjectsRes.data?.data || []);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleOpenDetail(cls: ClassWithDetails) {
    setSelectedClassDetail(cls);
    fetchClassDetails(cls.id);
  }

  function handleCloseDetail() {
    setSelectedClassDetail(null);
    setClassStudents([]);
    setClassSubjects([]);
  }

  function handleCreateClass() {
    setModalType("create");
    setOpenModal(true);
    setName("");
    setSection("");
    setSchoolYear("");
    setSchoolLevel("");
    setTeacherId("");
    setSelectedClass(null);
  }

  function handleUpdateClass(cls: Class) {
    setSelectedClass(cls);
    setName(cls.name);
    setSection(cls.section);
    setSchoolYear(cls.school_year);
    setSchoolLevel(cls.school_level);
    setTeacherId(cls.teacher_id?.toString() || "");
    setModalType("update");
    setOpenModal(true);
  }

  function handleAddStudentClick() {
    setModalType("addStudent");
    setOpenModal(true);
    setSelectedStudent("");
  }

  async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedStudent) {
      toast.warning("Please select a student");
      return;
    }

    try {
      await axios.post(
        "http://localhost:7000/class-students",
        {
          student_id: parseInt(selectedStudent),
          class_id: selectedClassDetail?.id,
        },
        { withCredentials: true },
      );

      toast.success("Student added successfully");
      handleCloseModal();
      await fetchClassDetails(selectedClassDetail!.id);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  function handleAddSubjectClick() {
    setModalType("addSubject");
    setOpenModal(true);
    setSelectedSubject("");
    setSelectedSubjectTeacher("");
    setSubjectTeachers([]);
  }

  async function handleSubjectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);

    if (subjectId) {
      try {
        const response = await axios.get(
          `http://localhost:7000/teacher-subjects?limit=1000`,
          { withCredentials: true },
        );

        const allTeacherSubjects = response.data?.data || [];
        const teachersForSubject = allTeacherSubjects
          .filter((ts: any) => ts.subject_id === parseInt(subjectId))
          .map((ts: any) => {
            const teacher = teachers.find((t) => t.id === ts.teacher_id);
            return {
              id: ts.teacher_id,
              name: teacher
                ? `${teacher.first_name} ${teacher.last_name}`
                : "Unknown",
            };
          });

        setSubjectTeachers(teachersForSubject);
        setSelectedSubjectTeacher("");
      } catch (e) {
        console.error("Error fetching teachers for subject", e);
      }
    }
  }

  async function handleAddSubject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedSubject || !selectedSubjectTeacher) {
      toast.warning("Please select a subject and teacher");
      return;
    }

    try {
      await axios.post(
        "http://localhost:7000/class-subjects",
        {
          class_id: selectedClassDetail?.id,
          subject_id: parseInt(selectedSubject),
          teacher_id: parseInt(selectedSubjectTeacher),
        },
        { withCredentials: true },
      );

      toast.success("Subject added successfully");
      handleCloseModal();
      await fetchClassDetails(selectedClassDetail!.id);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  async function handleEditSubjectTeacherClick(subject: ClassSubject) {
    setEditingSubject(subject);
    setEditTeacherId(subject.teacher_id.toString());
    setModalType("editSubjectTeacher");
    setOpenModal(true);

    // Load available teachers for this subject
    try {
      const response = await axios.get(
        `http://localhost:7000/teacher-subjects?limit=1000`,
        { withCredentials: true },
      );

      const allTeacherSubjects = response.data?.data || [];
      const teachersForSubject = allTeacherSubjects
        .filter((ts: any) => ts.subject_id === subject.subject_id)
        .map((ts: any) => {
          const teacher = teachers.find((t) => t.id === ts.teacher_id);
          return {
            id: ts.teacher_id,
            name: teacher
              ? `${teacher.first_name} ${teacher.last_name}`
              : "Unknown",
          };
        });

      setAvailableTeachersForSubject(teachersForSubject);
    } catch (e) {
      console.error("Error fetching teachers for subject", e);
    }
  }

  async function handleEditSubjectTeacher(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editTeacherId || !editingSubject) {
      toast.warning("Please select a teacher");
      return;
    }

    try {
      await axios.put(
        `http://localhost:7000/class-subjects/${editingSubject.id}/teacher`,
        {
          teacher_id: parseInt(editTeacherId),
        },
        { withCredentials: true },
      );

      toast.success("Teacher assignment updated successfully");
      handleCloseModal();
      await fetchClassDetails(selectedClassDetail!.id);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  async function handleClassModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !section || !school_year || !school_level) {
      toast.warning(
        "Name, Section, School Year, and School Level are required",
      );
      return;
    }

    const classData: ClassFormData = {
      name,
      section,
      school_year,
      school_level,
      teacher_id: teacher_id ? parseInt(teacher_id) : null,
    };

    try {
      if (modalType === "create") {
        await axios.post("http://localhost:7000/classes", classData, {
          withCredentials: true,
        });
        toast.success("Class created successfully");
      } else if (modalType === "update") {
        await axios.put(
          `http://localhost:7000/classes/${selectedClass?.id}`,
          classData,
          { withCredentials: true },
        );
        toast.success("Class updated successfully");
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

  async function handleDeleteClass(id: number) {
    addToast({
      type: "error",
      message: "Delete this class?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(`http://localhost:7000/classes/${id}`, {
              withCredentials: true,
            });
            toast.success("Class deleted successfully");
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

  async function handleDeleteStudent(classStudentId: number) {
    addToast({
      type: "error",
      message: "Remove this student?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(
              `http://localhost:7000/class-students/${classStudentId}`,
              {
                withCredentials: true,
              },
            );
            toast.success("Student removed successfully");
            await fetchClassDetails(selectedClassDetail!.id);
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

  async function handleDeleteSubject(classSubjectId: number) {
    addToast({
      type: "error",
      message: "Remove this subject?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(
              `http://localhost:7000/class-subjects/${classSubjectId}`,
              {
                withCredentials: true,
              },
            );
            toast.success("Subject removed successfully");
            await fetchClassDetails(selectedClassDetail!.id);
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

  function handleCloseModal() {
    setOpenModal(false);
    setModalType("");
    setName("");
    setSection("");
    setSchoolYear("");
    setSchoolLevel("");
    setTeacherId("");
    setSelectedClass(null);
    setSelectedStudent("");
    setSelectedSubject("");
    setSelectedSubjectTeacher("");
    setEditingSubject(null);
    setEditTeacherId("");
    setAvailableTeachersForSubject([]);
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
            <p className="text-lg font-semibold text-slate-900">
              Loading classes...
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Preparing class records, teachers, students, and subjects.
            </p>
          </div>
        </div>
      </div>
    );

  if (selectedClassDetail) {
    return (
      <article className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-100/70 to-transparent" />
        <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
        {/* Modal for adding students/subjects and editing teachers */}
        <div
          className={`fixed ${
            openModal ? "block opacity-100" : "hidden opacity-0"
          } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-950/50 px-4 transition-all overflow-y-auto backdrop-blur-sm`}
        >
          <form
            onSubmit={
              modalType === "addStudent"
                ? handleAddStudent
                : modalType === "editSubjectTeacher"
                  ? handleEditSubjectTeacher
                  : handleAddSubject
            }
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] my-8"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-emerald-50 px-6 py-5">
              <div className="grid place-items-center text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                  {modalType === "addStudent"
                    ? "Add Student"
                    : modalType === "editSubjectTeacher"
                      ? "Edit Subject Teacher"
                      : "Add Subject"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {modalType === "editSubjectTeacher"
                    ? "Update the teacher for this subject in the class. All enrolled students will be updated."
                    : "Keep the class organized with clear student and subject assignments."}
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
              {modalType === "addStudent" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Student *
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">Select a student</option>
                    {availableStudents
                      .filter(
                        (s) =>
                          !classStudents.some((cs) => cs.student_id === s.id),
                      )
                      .map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {modalType === "addSubject" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Subject *
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                      value={selectedSubject}
                      onChange={handleSubjectChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      {availableSubjects
                        .filter(
                          (s) =>
                            !classSubjects.some((cs) => cs.subject_id === s.id),
                        )
                        .map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {subjectTeachers.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Teacher *
                      </label>
                      <select
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        value={selectedSubjectTeacher}
                        onChange={(e) =>
                          setSelectedSubjectTeacher(e.target.value)
                        }
                        required
                      >
                        <option value="">Select a teacher</option>
                        {subjectTeachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {modalType === "editSubjectTeacher" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select New Teacher *
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    value={editTeacherId}
                    onChange={(e) => setEditTeacherId(e.target.value)}
                    required
                  >
                    <option value="">Select a teacher</option>
                    {availableTeachersForSubject.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  {editingSubject && (
                    <p className="mt-3 text-sm text-slate-600">
                      Subject: <strong>{editingSubject.name}</strong>
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
              >
                {modalType === "addStudent"
                  ? "Add Student"
                  : modalType === "editSubjectTeacher"
                    ? "Update Teacher"
                    : "Add Subject"}
              </button>
            </article>
          </form>
        </div>

        {/* Back button and header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCloseDetail}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
          >
            <FaArrowLeft /> Back to Classes
          </button>
        </div>

        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-emerald-50 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">
                  Class Details
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  {selectedClassDetail.name} - {selectedClassDetail.section}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Year {selectedClassDetail.school_year} •{" "}
                  {selectedClassDetail.school_level}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:min-w-[520px]">
                <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Students
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {classStudents.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Subjects
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {classSubjects.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Teachers
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {totalTeachers}
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Classes
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {totalClasses}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Adviser
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedClassDetail.teacher_id
                    ? teachers.find(
                        (teacher) =>
                          teacher.id === selectedClassDetail.teacher_id,
                      )?.first_name || "Unassigned"
                    : "Unassigned"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Assigned
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {assignedClasses}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Students total
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {totalStudents}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Level
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 capitalize">
                  {selectedClassDetail.school_level}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Students</h2>
            <button
              onClick={handleAddStudentClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaPlus /> Add Student
            </button>
          </div>

          {detailLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : classStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Student ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Sex
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {classStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{student.student_id}</td>
                      <td className="px-6 py-4">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4">{student.sex}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No students in this class</p>
            </div>
          )}
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Subjects</h2>
            <button
              onClick={handleAddSubjectClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              <FaPlus /> Add Subject
            </button>
          </div>

          {classSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Teacher
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {classSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{subject.code}</td>
                      <td className="px-6 py-4">{subject.name}</td>
                      <td className="px-6 py-4">{subject.teacher_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              handleEditSubjectTeacherClick(subject)
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Teacher"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Remove"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p>No subjects in this class</p>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="p-6 bg-gray-50 min-h-screen">
      {/* Modal for create/update class */}
      <div
        className={`fixed ${
          openModal ? "block opacity-100" : "hidden opacity-0"
        } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-gray-300/40 transition-all`}
      >
        <form
          onSubmit={handleClassModalSubmit}
          className="shadow-lg bg-white rounded-md p-5 w-full max-w-md relative"
        >
          <div className="grid place-items-center">
            <h1 className="text-xl font-bold">
              {modalType === "create" ? "Create Class" : "Update Class"}
            </h1>
            <span
              className="p-2 absolute top-0 right-0 cursor-pointer text-gray-300 hover:text-black"
              onClick={handleCloseModal}
            >
              <FaTimes className="text-lg" />
            </span>
          </div>

          <article className="mt-5 space-y-3">
            <div>
              <label className="text-base">Class Name *</label>
              <input
                type="text"
                placeholder="e.g., Grade 10"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-base">Section *</label>
              <input
                type="text"
                placeholder="e.g., A, B, C"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-base">School Year *</label>
              <input
                type="text"
                placeholder="e.g., 2025-2026"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={school_year}
                onChange={(e) => setSchoolYear(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-base">School Level *</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-md"
                value={school_level}
                onChange={(e) => setSchoolLevel(e.target.value)}
                required
              >
                <option value="">Select Level</option>
                <option value="elementary">Elementary</option>
                <option value="highschool">Highschool</option>
                <option value="college">College</option>
              </select>
            </div>
            <div>
              <label className="text-base">Class Adviser</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-md"
                value={teacher_id}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">Select Teacher (Optional)</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`w-full mt-5 text-white rounded-md p-2 font-semibold transition ${
                modalType === "create"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {modalType === "create" ? "Create Class" : "Update Class"}
            </button>
          </article>
        </form>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Manage Classes
        </h1>
        <p className="text-gray-600">
          View classes and manage students and subjects
        </p>
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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by class name or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap"
            onClick={handleCreateClass}
          >
            <FaPlus /> Create Class
          </button>
        </div>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300" />
            {/* Card clickable area */}
            <div
              onClick={() => handleOpenDetail(cls)}
              className="cursor-pointer p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {cls.school_level}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                    {cls.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Section {cls.section} · {cls.school_year}
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Adviser
                  </p>
                  <p className="mt-1 max-w-[10rem] truncate text-sm font-semibold text-slate-900">
                    {cls.adviser_name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                  <p className="text-3xl font-bold leading-none text-sky-700">
                    {cls.student_count || 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Students
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                  <p className="text-3xl font-bold leading-none text-emerald-700">
                    {cls.subject_count || 0}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Subjects
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Tap to view details
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  cls.teacher_id
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {cls.teacher_id ? "Assigned" : "Unassigned"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 px-6 pb-5 pt-1 opacity-0 translate-y-1 pointer-events-none transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={() => handleUpdateClass(cls)}
                className="inline-flex items-center justify-center rounded-xl border border-sky-100 bg-sky-50 p-2.5 text-sky-700 transition hover:bg-sky-100"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="inline-flex items-center justify-center rounded-xl border border-rose-100 bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No classes found</p>
        </div>
      )}
    </article>
  );
}
