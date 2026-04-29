import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useToast, useToastHelper } from "../../context/ToastContext";

interface Student {
  id: number;
  student_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  birth_date: string;
  lrn: string;
  sex: string;
  level: string;
}

interface StudentFormData {
  student_id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  age: number;
  birth_date: string;
  lrn: string;
  sex: string;
  level: string;
}

export default function ManageStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update" | "">("");
  const [openImportModal, setOpenImportModal] = useState(false);
  const [importPreviewRows, setImportPreviewRows] = useState<any[] | null>(
    null,
  );
  const [importLoading, setImportLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [student_id, setStudentId] = useState("");
  const [first_name, setFirstName] = useState("");
  const [middle_name, setMiddleName] = useState("");
  const [last_name, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [lrn, setLrn] = useState("");
  const [sex, setSex] = useState("");
  const [level, setLevel] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { addToast } = useToast();
  const toast = useToastHelper();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:7000/students?limit=1000",
        {
          withCredentials: true,
        },
      );
      setStudents(response.data?.data || []);
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

  const filteredStudents = students.filter(
    (student) =>
      `${student.first_name} ${student.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.lrn.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleUpdate(student: Student) {
    setSelectedStudent(student);
    setStudentId(student.student_id.toString());
    setFirstName(student.first_name);
    setMiddleName(student.middle_name);
    setLastName(student.last_name);
    setAge(student.age.toString());
    setBirthDate(student.birth_date);
    setLrn(student.lrn);
    setSex(student.sex);
    setLevel(student.level);
    setModalType("update");
    setOpenModal(true);
  }

  async function handleModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !first_name ||
      !last_name ||
      !age ||
      !birth_date ||
      !lrn ||
      !sex ||
      !level
    ) {
      toast.warning("All fields are required");
      return;
    }

    const studentData: StudentFormData = {
      first_name,
      middle_name,
      last_name,
      age: parseInt(age),
      birth_date,
      lrn,
      sex,
      level,
    };

    if (modalType === "create" && student_id) {
      studentData.student_id = parseInt(student_id);
    }

    try {
      if (modalType === "create") {
        await axios.post("http://localhost:7000/students", studentData, {
          withCredentials: true,
        });
        toast.success("Student created successfully");
      } else {
        await axios.put(
          `http://localhost:7000/students/${selectedStudent?.id}`,
          studentData,
          {
            withCredentials: true,
          },
        );
        toast.success("Student updated successfully");
      }

      await fetchStudents();
      handleCloseModal();
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
    }
  }

  async function handleDelete(id: number) {
    addToast({
      type: "error",
      message: "Delete this student?",
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axios.delete(`http://localhost:7000/students/${id}`, {
              withCredentials: true,
            });
            toast.success("Student deleted successfully");
            await fetchStudents();
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
    setStudentId("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setAge("");
    setBirthDate("");
    setLrn("");
    setSex("");
    setLevel("");
    setSelectedStudent(null);
  }

  if (loading)
    return (
      <div className="p-8 text-center text-lg text-slate-600 bg-slate-50 min-h-screen">
        Loading students...
      </div>
    );

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      {/* Modal */}
      <div
        className={`fixed ${
          openModal ? "block opacity-100" : "hidden opacity-0"
        } z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-900/40 transition-all overflow-y-auto`}
      >
        <form
          onSubmit={handleModalSubmit}
          className="shadow-2xl bg-white rounded-xl p-8 w-full max-w-md relative my-8 border border-slate-200"
        >
          <div className="grid place-items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {modalType === "create" ? "Create Student" : "Update Student"}
            </h1>
            <span
              className="p-2 absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
              onClick={handleCloseModal}
            >
              <FaTimes className="text-xl" />
            </span>
          </div>

          <article className="space-y-4 max-h-96 overflow-y-auto">
            {modalType === "create" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Student ID
                </label>
                <input
                  type="number"
                  placeholder="12345"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={student_id}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Middle Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Michael"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={middle_name}
                onChange={(e) => setMiddleName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="15"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Birth Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={birth_date}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                LRN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0123456789"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={lrn}
                onChange={(e) => setLrn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sex <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                required
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Level <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., college, highschool"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
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
              {modalType === "create" ? "Create Student" : "Update Student"}
            </button>
          </article>
        </form>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Manage Students
        </h1>
        <p className="text-lg text-slate-600">
          Add, edit, and manage student information
        </p>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 text-rose-700 rounded-lg mb-6 border border-rose-200">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchStudents}
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
              placeholder="Search by name or LRN..."
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
              setStudentId("");
              setFirstName("");
              setMiddleName("");
              setLastName("");
              setAge("");
              setBirthDate("");
              setLrn("");
              setSex("");
              setLevel("");
            }}
          >
            <FaPlus /> Create Student
          </button>
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95"
          onClick={() => {
            setOpenImportModal(true);
            setImportPreviewRows(null);
          }}
        >
          Import XLSX
        </button>
      </div>

      {/* Table */}

      {/* Import Modal */}
      <div
        className={`fixed ${openImportModal ? "block opacity-100" : "hidden opacity-0"} z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-900/40 transition-all overflow-y-auto`}
      >
        <div className="shadow-2xl bg-white rounded-xl p-6 w-full max-w-3xl relative my-8 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Import Students (XLSX)</h2>
            <button
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setOpenImportModal(false)}
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload file
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImportLoading(true);
                  setImportPreviewRows(null);
                  try {
                    const fd = new FormData();
                    fd.append("file", f);
                    const resp = await axios.post(
                      "http://localhost:7000/students/import/preview",
                      fd,
                      { withCredentials: true },
                    );
                    setImportPreviewRows(resp.data?.data?.rows || []);
                  } catch (err) {
                    const msg = axios.isAxiosError(err)
                      ? err.response?.data?.msg || err.message
                      : String(err);
                    toast.error(msg);
                  } finally {
                    setImportLoading(false);
                  }
                }}
              />
              <p className="text-sm text-slate-500 mt-2">
                Accepted columns: id, student_id, studentId, student_number,
                studentNo, first_name, middle_name, last_name, lrn, birthdate,
                sex, class_level
              </p>
            </div>

            {importLoading && <div>Parsing file...</div>}

            {importPreviewRows && (
              <div>
                <h3 className="font-semibold mb-2">
                  Preview ({importPreviewRows.length} rows)
                </h3>
                <div className="overflow-x-auto max-h-72 overflow-y-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                          Row
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                          Student ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                          LRN
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                          Issues
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreviewRows.map((r: any) => (
                        <tr key={r.row} className={r.valid ? "" : "bg-rose-50"}>
                          <td className="px-4 py-2 text-sm text-slate-700">
                            {r.row}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-900">
                            {r.normalized?.first_name || ""}{" "}
                            {r.normalized?.last_name || ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-600">
                            {r.normalized?.student_id ?? ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-600">
                            {r.normalized?.lrn ?? ""}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {r.status === "valid" ? (
                              <span className="text-emerald-700 font-semibold">
                                Valid
                              </span>
                            ) : r.status === "duplicate" ? (
                              <span className="text-amber-700 font-semibold">
                                Duplicate
                              </span>
                            ) : r.status === "conflict" ? (
                              <span className="text-rose-700 font-semibold">
                                Conflict
                              </span>
                            ) : (
                              <span className="text-rose-600">Invalid</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-slate-600">
                            {(r.issues || []).join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
                    onClick={() => setImportPreviewRows(null)}
                  >
                    Clear
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                    onClick={async () => {
                      const validRows = importPreviewRows.filter(
                        (r: any) => r.valid,
                      );
                      if (validRows.length === 0) {
                        toast.warning("No valid rows to import");
                        return;
                      }

                      try {
                        setImportLoading(true);
                        const resp = await axios.post(
                          "http://localhost:7000/students/import",
                          { rows: validRows },
                          { withCredentials: true },
                        );
                        const data = resp.data?.data;
                        toast.success(
                          `Imported ${data.summary.inserted} rows, skipped ${data.summary.skipped}`,
                        );
                        setOpenImportModal(false);
                        await fetchStudents();
                      } catch (err) {
                        const msg = axios.isAxiosError(err)
                          ? err.response?.data?.msg || err.message
                          : String(err);
                        toast.error(msg);
                      } finally {
                        setImportLoading(false);
                      }
                    }}
                  >
                    Import Valid Rows
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    LRN
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Level
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {student.first_name} {student.middle_name}{" "}
                      {student.last_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{student.lrn}</td>
                    <td className="px-6 py-4 text-slate-600">{student.age}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.level}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleUpdate(student)}
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200"
                          title="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p className="font-medium">No students found</p>
          </div>
        )}
      </div>
    </article>
  );
}
