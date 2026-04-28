import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useToastHelper } from "../../context/ToastContext";

interface Teacher {
  id: number;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string;
}

interface TeacherFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
}

export default function ManageTeachers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update" | "">("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const toast = useToastHelper();

  // Fetch teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:7000/teachers?limit=1000",
        {
          withCredentials: true,
        },
      );
      setTeachers(response.data?.data || []);
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

  const filteredTeachers = teachers.filter(
    (teacher) =>
      `${teacher.first_name} ${teacher.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleUpdate(teacher: Teacher) {
    setSelectedTeacher(teacher);
    setFirstName(teacher.first_name || "");
    setMiddleName(teacher.middle_name || "");
    setLastName(teacher.last_name || "");
    setEmail(teacher.email);
    setModalType("update");
    setOpenModal(true);
  }

  async function handleModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) {
      toast.warning("Email is required");
      return;
    }

    const teacherData: Partial<TeacherFormData> = {
      email,
    };

    if (first_name) teacherData.first_name = first_name;
    if (middle_name) teacherData.middle_name = middle_name;
    if (last_name) teacherData.last_name = last_name;

    try {
      if (modalType === "create") {
        await axios.post("http://localhost:7000/teachers", teacherData, {
          withCredentials: true,
        });
        toast.success("Teacher created successfully");
      } else {
        await axios.put(
          `http://localhost:7000/teachers/${selectedTeacher?.id}`,
          teacherData,
          {
            withCredentials: true,
          },
        );
        toast.success("Teacher updated successfully");
      }

      await fetchTeachers();
      handleCloseModal();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  async function handleDelete(id: number) {
    // Create a simple confirm-like UI using toast with action
    toast.error("Delete this teacher?", {
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(`http://localhost:7000/teachers/${id}`, {
              withCredentials: true,
            });
            toast.success("Teacher deleted successfully");
            await fetchTeachers();
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
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEmail("");
    setSelectedTeacher(null);
  }

  if (loading)
    return (
      <div className="p-8 text-center text-lg text-slate-600 bg-slate-50 min-h-screen">
        Loading teachers...
      </div>
    );

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Modal */}
      <div
        className={`fixed ${
          openModal ? "block opacity-100" : "hidden opacity-0"
        } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-900/40 transition-all duration-300`}
      >
        <form
          onSubmit={handleModalSubmit}
          className="shadow-2xl bg-white rounded-xl p-8 w-full max-w-md relative border border-slate-200"
        >
          <div className="grid place-items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {modalType === "create" ? "Create Teacher" : "Update Teacher"}
            </h1>
            <span
              className="p-2 absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
              onClick={handleCloseModal}
            >
              <FaTimes className="text-xl" />
            </span>
          </div>

          <article className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                placeholder="Michael"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={middle_name}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full mt-6 text-white rounded-lg px-4 py-2.5 font-semibold transition-all duration-200 ${
                modalType === "create"
                  ? "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {modalType === "create" ? "Create Teacher" : "Update Teacher"}
            </button>
          </article>
        </form>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Manage Teachers
        </h1>
        <p className="text-lg text-slate-600">
          Add, edit, and manage teacher information
        </p>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-lg mb-6 border border-rose-200">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchTeachers}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95"
            onClick={() => {
              setModalType("create");
              setOpenModal(true);
              setFirstName("");
              setMiddleName("");
              setLastName("");
              setEmail("");
            }}
          >
            <FaPlus /> Create Teacher
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredTeachers.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {[
                      teacher.first_name,
                      teacher.middle_name,
                      teacher.last_name,
                    ]
                      .filter(Boolean)
                      .join(" ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{teacher.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(teacher)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-2 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium">No teachers found</p>
          </div>
        )}
      </div>
    </article>
  );
}
