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
    "create" | "update" | "addStudent" | "addSubject" | ""
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

  const toast = useToastHelper();
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes, studentRes, subjectRes] = await Promise.all([
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
      ]);

      const allTeachers = teacherRes.data?.data || [];
      const allClasses = (classRes.data?.data || []).map((cls: Class) => ({
        ...cls,
        adviser_name: allTeachers.find((t: any) => t.id === cls.teacher_id)
          ? `${allTeachers.find((t: any) => t.id === cls.teacher_id).first_name} ${allTeachers.find((t: any) => t.id === cls.teacher_id).last_name}`
          : "Unassigned",
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
  }

  if (loading)
    return <div className="p-6 text-center text-lg">Loading classes...</div>;

  if (selectedClassDetail) {
    return (
      <article className="p-6 bg-gray-50 min-h-screen">
        {/* Modal for adding students/subjects */}
        <div
          className={`fixed ${
            openModal ? "block opacity-100" : "hidden opacity-0"
          } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-gray-300/40 transition-all overflow-y-auto`}
        >
          <form
            onSubmit={
              modalType === "addStudent" ? handleAddStudent : handleAddSubject
            }
            className="shadow-lg bg-white rounded-md p-5 w-full max-w-md relative my-8"
          >
            <div className="grid place-items-center">
              <h1 className="text-xl font-bold">
                {modalType === "addStudent" ? "Add Student" : "Add Subject"}
              </h1>
              <span
                className="p-2 absolute top-0 right-0 cursor-pointer text-gray-300 hover:text-black"
                onClick={handleCloseModal}
              >
                <FaTimes className="text-lg" />
              </span>
            </div>

            <article className="mt-5 space-y-3">
              {modalType === "addStudent" && (
                <div>
                  <label className="text-base">Student *</label>
                  <select
                    className="w-full border border-gray-300 p-2 rounded-md"
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
                    <label className="text-base">Subject *</label>
                    <select
                      className="w-full border border-gray-300 p-2 rounded-md"
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
                      <label className="text-base">Teacher *</label>
                      <select
                        className="w-full border border-gray-300 p-2 rounded-md"
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

              <button
                type="submit"
                className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white rounded-md p-2 font-semibold transition"
              >
                {modalType === "addStudent" ? "Add Student" : "Add Subject"}
              </button>
            </article>
          </form>
        </div>

        {/* Back button and header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCloseDetail}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <FaArrowLeft /> Back to Classes
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {selectedClassDetail.name} - {selectedClassDetail.section}
          </h1>
          <p className="text-gray-600">
            Year: {selectedClassDetail.school_year} | Level:{" "}
            {selectedClassDetail.school_level}
          </p>
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
                        <div className="flex justify-center">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
          >
            {/* Card clickable area */}
            <div
              onClick={() => handleOpenDetail(cls)}
              className="p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {cls.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Section {cls.section} | {cls.school_year}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-semibold">Adviser:</span>{" "}
                {cls.adviser_name}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-2xl font-bold text-blue-600">
                    {cls.student_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Students</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-2xl font-bold text-green-600">
                    {cls.subject_count || 0}
                  </p>
                  <p className="text-xs text-gray-600">Subjects</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => handleUpdateClass(cls)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteClass(cls.id)}
                className="text-red-600 hover:text-red-800"
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
