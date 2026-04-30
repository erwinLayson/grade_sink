import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useToast, useToastHelper } from "../../context/ToastContext";
import * as XLSX from "xlsx";

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
  const [selectedLevel, setSelectedLevel] = useState<string>(""); // "" means all levels
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update" | "">("");
  const [openImportModal, setOpenImportModal] = useState(false);
  const [importPreviewRows, setImportPreviewRows] = useState<any[] | null>(
    null,
  );
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [columnStatus, setColumnStatus] = useState<Record<
    string,
    boolean
  > | null>(null);
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
  }, [selectedLevel]); // Refetch when level filter changes

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("limit", "1000");
      if (selectedLevel) {
        params.append("level", selectedLevel);
      }
      const response = await axios.get(
        `http://localhost:7000/students?${params.toString()}`,
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

  // Fixed school levels
  const schoolLevels = ["Elementary", "High School", "Senior High School"];

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
              <div className="space-y-3">
                {["Elementary", "High School", "Senior High School"].map(
                  (lvl) => (
                    <label
                      key={lvl}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="level"
                        value={lvl}
                        checked={level === lvl}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        required
                      />
                      <span className="text-slate-700">{lvl}</span>
                    </label>
                  ),
                )}
              </div>
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

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {schoolLevels.map((level) => (
            <button
              key={level}
              onClick={() =>
                setSelectedLevel(selectedLevel === level ? "" : level)
              }
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedLevel === level
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
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
              onClick={() => {
                setOpenImportModal(false);
                setImportError(null);
                setImportPreviewRows(null);
                setColumnStatus(null);
              }}
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
                  setImportError(null);
                  setColumnStatus(null);
                  try {
                    // Parse XLSX locally to validate headers
                    const arrayBuffer = await f.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rawData = XLSX.utils.sheet_to_json(worksheet);

                    // Extract headers (column names) from first row
                    // Normalize: lowercase, trim, replace spaces/underscores with nothing for comparison
                    const normalize = (str: string) =>
                      str
                        .toLowerCase()
                        .trim()
                        .replace(/[\s_-]+/g, "");
                    const rawHeaders =
                      rawData.length > 0
                        ? Object.keys(rawData[0] as Record<string, unknown>)
                        : [];
                    const headers = rawHeaders.map(normalize);

                    // Define required columns with aliases (matching backend normalization)
                    const requiredColumns = {
                      student_id: [
                        "student_id",
                        "studentid",
                        "student_number",
                        "studentno",
                        "id",
                      ],
                      first_name: [
                        "first_name",
                        "firstname",
                        "given_name",
                        "first name",
                      ],
                      middle_name: ["middle_name", "middlename", "middle name"],
                      last_name: [
                        "last_name",
                        "lastname",
                        "family_name",
                        "last name",
                      ],
                      age: ["age"],
                      birth_date: [
                        "birthdate",
                        "birth_date",
                        "dob",
                        "birth date",
                      ],
                      lrn: ["lrn"],
                      sex: ["sex", "gender"],
                      level: [
                        "level",
                        "class_level",
                        "class level",
                        "grade_level",
                      ],
                    };

                    // Check if all required columns are present and track status
                    const status: Record<string, boolean> = {};
                    const missingColumns: string[] = [];
                    for (const [colName, aliases] of Object.entries(
                      requiredColumns,
                    )) {
                      const found = aliases.some((alias) =>
                        headers.includes(normalize(alias)),
                      );
                      status[colName] = found;
                      if (!found) {
                        missingColumns.push(colName);
                      }
                    }

                    if (missingColumns.length > 0) {
                      setColumnStatus(status);
                      setImportError(
                        `Missing required columns: ${missingColumns.join(", ")}`,
                      );
                      setImportLoading(false);
                      return;
                    }

                    setColumnStatus(null);

                    // Validate level values
                    const validLevels = [
                      "elementary",
                      "high school",
                      "senior high school",
                    ];
                    const levelColumnName = rawHeaders.find((h) =>
                      [
                        "level",
                        "class_level",
                        "class level",
                        "grade_level",
                      ].some(
                        (alias) =>
                          h
                            .toLowerCase()
                            .trim()
                            .replace(/[\s_-]+/g, "") ===
                          alias
                            .toLowerCase()
                            .trim()
                            .replace(/[\s_-]+/g, ""),
                      ),
                    );

                    if (levelColumnName) {
                      const invalidLevelRows: {
                        row: number;
                        value: string;
                      }[] = [];
                      rawData.forEach((row: any, idx: number) => {
                        const levelValue = row[levelColumnName];
                        if (
                          levelValue &&
                          !validLevels.includes(
                            String(levelValue)
                              .toLowerCase()
                              .trim()
                              .replace(/[\s_-]+/g, ""),
                          )
                        ) {
                          invalidLevelRows.push({
                            row: idx + 2, // +2 because idx is 0-based and row 1 is header
                            value: String(levelValue),
                          });
                        }
                      });

                      if (invalidLevelRows.length > 0) {
                        const invalidList = invalidLevelRows
                          .slice(0, 5) // Show first 5 invalid rows
                          .map((r) => `Row ${r.row}: "${r.value}"`)
                          .join(", ");
                        const moreMsg =
                          invalidLevelRows.length > 5
                            ? ` (+ ${invalidLevelRows.length - 5} more)`
                            : "";
                        setImportError(
                          `Invalid level values: ${invalidList}${moreMsg}. Valid levels are: Elementary, High School, Senior High School`,
                        );
                        setImportLoading(false);
                        return;
                      }
                    }

                    // If headers and level values valid, proceed with backend preview
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
                    setImportError(msg);
                  } finally {
                    setImportLoading(false);
                  }
                }}
              />
              <p className="text-sm text-slate-500 mt-2">
                <strong>Required columns (spaces/underscores ignored):</strong>
                <br />
                • Student ID: student_id, studentid, student_number, studentno,
                id
                <br />
                • First Name: first_name, firstname, given_name
                <br />
                • Middle Name: middle_name, middlename
                <br />
                • Last Name: last_name, lastname, family_name
                <br />
                • Age: age
                <br />
                • Birth Date: birthdate, birth_date, dob
                <br />
                • LRN: lrn
                <br />
                • Sex/Gender: sex, gender
                <br />• Level: level, class_level, grade_level
              </p>
            </div>

            {importError && (
              <div
                className={`p-4 rounded-lg border ${
                  columnStatus
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <p className="font-semibold mb-3">{importError}</p>

                {columnStatus && (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-amber-800">Column Status:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(columnStatus).map(
                        ([colName, isFound]) => (
                          <div
                            key={colName}
                            className="flex items-center gap-2 p-2 rounded bg-white bg-opacity-60"
                          >
                            <span
                              className={
                                isFound
                                  ? "text-emerald-600 font-bold text-lg"
                                  : "text-rose-600 font-bold text-lg"
                              }
                            >
                              {isFound ? "✓" : "✗"}
                            </span>
                            <span
                              className={
                                isFound
                                  ? "text-emerald-900"
                                  : "text-rose-900 font-medium"
                              }
                            >
                              {colName.replace(/_/g, " ").toUpperCase()}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {importLoading && <div>Parsing file...</div>}

            {importPreviewRows && (
              <div>
                <h3 className="font-semibold mb-4">
                  Preview ({importPreviewRows.length} rows)
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4 bg-slate-50">
                  {importPreviewRows.map((r: any, idx: number) => {
                    const rowBgColor =
                      r.status === "valid"
                        ? "bg-emerald-50"
                        : r.status === "duplicate"
                          ? "bg-amber-50"
                          : "bg-rose-50";
                    const statusColor =
                      r.status === "valid"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "duplicate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800";

                    return (
                      <div
                        key={idx}
                        className={`${rowBgColor} border-l-4 rounded p-3 ${
                          r.status === "valid"
                            ? "border-emerald-400"
                            : r.status === "duplicate"
                              ? "border-amber-400"
                              : "border-rose-400"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-slate-600">
                                Row {r.row}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
                              >
                                {r.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                              {Object.entries(r.raw).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-slate-500 font-medium">
                                    {key}:
                                  </span>
                                  <div className="text-slate-900 truncate">
                                    {value ? String(value) : "—"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {r.issues && r.issues.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                            <div className="text-xs font-semibold text-slate-700 mb-1">
                              Issues:
                            </div>
                            <ul className="space-y-1">
                              {r.issues.map(
                                (issue: string, issueIdx: number) => (
                                  <li
                                    key={issueIdx}
                                    className="text-xs text-slate-700 flex items-start gap-2"
                                  >
                                    <span className="text-red-500 mt-0.5">
                                      •
                                    </span>
                                    <span>{issue}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300"
                    onClick={() => {
                      setImportPreviewRows(null);
                      setImportError(null);
                      setColumnStatus(null);
                    }}
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
                        setImportError(null);
                        setImportPreviewRows(null);
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
