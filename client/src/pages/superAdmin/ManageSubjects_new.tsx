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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectRes, teacherRes, teacherSubjectRes] = await Promise.all([
        axios.get("http://localhost:7000/subjects?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/teachers?limit=1000", {
          withCredentials: true,
        }),
        axios.get("http://localhost:7000/teacher-subjects?limit=1000", {
          withCredentials: true,
        }),
      ]);

      const allTeachers = teacherRes.data?.data || [];
      const allTeacherSubjects = teacherSubjectRes.data?.data || [];

      // Count teachers per subject
      const subjectsWithCount = (subjectRes.data?.data || []).map(
        (subject: Subject) => ({
          ...subject,
          teacher_count: allTeacherSubjects.filter(
            (ts: any) => ts.subject_id === subject.id,
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
      alert(errorMsg);
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
      return alert("Code and Name are required");
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
        alert("Subject created successfully");
      } else {
        await axios.put(
          `http://localhost:7000/subjects/${selectedSubject?.id}`,
          subjectData,
          {
            withCredentials: true,
          },
        );
        alert("Subject updated successfully");
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
      alert(errorMsg);
    }
  }

  async function handleAddTeacher(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedTeacher) {
      return alert("Please select a teacher");
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

      alert("Teacher added successfully");
      setSelectedTeacher("");
      await fetchSubjectTeachers(selectedSubjectDetail!.id);
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      alert(errorMsg);
    }
  }

  async function handleDeleteSubject(id: number) {
    if (confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`http://localhost:7000/subjects/${id}`, {
          withCredentials: true,
        });
        alert("Subject deleted successfully");
        await fetchData();
      } catch (e) {
        const errorMsg = axios.isAxiosError(e)
          ? e.response?.data?.msg || e.message
          : String(e);
        alert(errorMsg);
      }
    }
  }

  async function handleDeleteTeacher(teacherSubjectId: number) {
    if (confirm("Are you sure you want to remove this teacher?")) {
      try {
        await axios.delete(
          `http://localhost:7000/teacher-subjects/${teacherSubjectId}`,
          {
            withCredentials: true,
          },
        );
        alert("Teacher removed successfully");
        await fetchSubjectTeachers(selectedSubjectDetail!.id);
        await fetchData(); // Update teacher count on cards
      } catch (e) {
        const errorMsg = axios.isAxiosError(e)
          ? e.response?.data?.msg || e.message
          : String(e);
        alert(errorMsg);
      }
    }
  }

  async function handleUpdateSubjectFromDetail(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!code || !name) {
      return alert("Code and Name are required");
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

      alert("Subject updated successfully");
      await fetchData();
      handleCloseDetail();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      alert(errorMsg);
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
    return <div className="p-6 text-center text-lg">Loading subjects...</div>;

  if (selectedSubjectDetail) {
    return (
      <article className="p-6 bg-gray-50 min-h-screen">
        {/* Modal for adding teacher */}
        <div
          className={`fixed ${
            openModal ? "block opacity-100" : "hidden opacity-0"
          } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-gray-300/40 transition-all`}
        >
          <form
            onSubmit={handleAddTeacher}
            className="shadow-lg bg-white rounded-md p-5 w-full max-w-md relative"
          >
            <div className="grid place-items-center">
              <h1 className="text-xl font-bold">Add Teacher</h1>
              <span
                className="p-2 absolute top-0 right-0 cursor-pointer text-gray-300 hover:text-black"
                onClick={() => {
                  setOpenModal(false);
                  setSelectedTeacher("");
                }}
              >
                <FaTimes className="text-lg" />
              </span>
            </div>

            <article className="mt-5 space-y-3">
              <div>
                <label className="text-base">Teacher *</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded-md"
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
                className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white rounded-md p-2 font-semibold transition"
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
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <FaArrowLeft /> Back to Subjects
          </button>
        </div>

        {/* Detail View - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Subject Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Subject Details</h2>
            <form onSubmit={handleUpdateSubjectFromDetail}>
              <div className="space-y-4">
                <div>
                  <label className="text-base font-semibold">Code *</label>
                  <input
                    type="text"
                    placeholder="e.g., ENG101"
                    className="w-full border border-gray-300 p-2 rounded-md mt-2"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-base font-semibold">Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., English Literature"
                    className="w-full border border-gray-300 p-2 rounded-md mt-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Teachers List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Assigned Teachers</h2>
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                <FaPlus /> Add Teacher
              </button>
            </div>

            {detailLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : subjectTeachers.length > 0 ? (
              <div className="space-y-3">
                {subjectTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {teacher.teacher_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Remove teacher"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No teachers assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="p-6 bg-gray-50 min-h-screen">
      {/* Modal for create/update subject */}
      <div
        className={`fixed ${
          openModal ? "block opacity-100" : "hidden opacity-0"
        } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-gray-300/40 transition-all overflow-y-auto`}
      >
        <form
          onSubmit={handleSubjectModalSubmit}
          className="shadow-lg bg-white rounded-md p-5 w-full max-w-md relative my-8"
        >
          <div className="grid place-items-center">
            <h1 className="text-xl font-bold">
              {modalType === "create"
                ? "Create Subject with Teachers"
                : "Update Subject"}
            </h1>
            <span
              className="p-2 absolute top-0 right-0 cursor-pointer text-gray-300 hover:text-black"
              onClick={handleCloseModal}
            >
              <FaTimes className="text-lg" />
            </span>
          </div>

          <article className="mt-5 space-y-4">
            <div>
              <label className="text-base">Subject Code *</label>
              <input
                type="text"
                placeholder="e.g., ENG101"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-base">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g., English Literature"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {modalType === "create" && (
              <div>
                <label className="text-base font-semibold mb-2 block">
                  Assign Teachers (Optional)
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <label
                        key={teacher.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => toggleTeacherSelection(teacher.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          {teacher.first_name} {teacher.last_name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No teachers available
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full mt-5 text-white rounded-md p-2 font-semibold transition ${
                modalType === "create"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {modalType === "create" ? "Create Subject" : "Update Subject"}
            </button>
          </article>
        </form>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Manage Subjects
        </h1>
        <p className="text-gray-600">Add and manage subjects with teachers</p>
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
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap"
            onClick={handleCreateSubject}
          >
            <FaPlus /> Create Subject
          </button>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
          >
            {/* Card clickable area */}
            <div
              onClick={() => handleOpenDetail(subject)}
              className="p-6 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">
                    {subject.code}
                  </h3>
                  <h2 className="text-xl font-bold text-gray-800 mt-1">
                    {subject.name}
                  </h2>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {subject.teacher_count || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">Teachers Assigned</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => handleUpdateSubject(subject)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No subjects found</p>
        </div>
      )}
    </article>
  );
}
