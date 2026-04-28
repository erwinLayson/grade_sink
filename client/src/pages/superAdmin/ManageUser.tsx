import { useState } from "react";
import { FaPlus, FaEdit, FaSearch, FaTimes } from "react-icons/fa";

// API
import axios from "axios";

// custom hooks
import useGetUser from "../../hooks/useGetUser";
import { useToastHelper } from "../../context/ToastContext";

interface UserDetailsProps {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export default function ManageUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"create" | "update" | "">("");

  const [username, setUserName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");

  // hooks
  const { users, isLoading, error, refetchUsers } = useGetUser();
  const toast = useToastHelper();

  if (isLoading)
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-slate-600 font-medium">Loading users...</p>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto p-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <h2 className="font-bold text-lg mb-2">Error loading users</h2>
          <p className="text-rose-600 mb-4">{error}</p>
          <button
            onClick={() => refetchUsers()}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="text-center text-slate-500 py-12">
          <p className="text-lg font-medium">No users found</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-indigo-100 text-indigo-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "teacher":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  function handleUpdate(user: any) {
    console.log(user);
    // Populate form fields with selected user data
    setUserName(user.username);
    setemail(user.email);
    setpassword(""); // Clear password for security
    setrole(user.role);
  }

  async function handleModalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let resAPI: string = "http://localhost:7000/";

    if (!username) {
      toast.warning("Username is required");
      return;
    }
    if (!email) {
      toast.warning("Email is required");
      return;
    }

    if (modalType === "create") {
      if (!password) {
        toast.warning("Password is required");
        return;
      }
      if (!role) {
        toast.warning("Role is required");
        return;
      }
    }

    const userDetails: UserDetailsProps = {
      username,
      email,
      password,
    };

    if (role) {
      userDetails.role = role;
    }

    try {
      let result;

      if (modalType === "create") {
        result = await axios.post(`${resAPI}users`, userDetails, {
          withCredentials: true,
        });
      } else {
        result = await axios.put(`${resAPI}users/${email}`, userDetails, {
          withCredentials: true,
        });
      }

      console.log(result.data);

      // Show success message
      toast.success(result.data?.msg || "Operation successful");

      // Refetch users to get updated list
      await refetchUsers();

      // Clear form and close modal
      setUserName("");
      setemail("");
      setpassword("");
      setrole("");
      setOpenModal(false);
      setModalType("");
    } catch (e) {
      const errorMsg = axios.isAxiosError(e)
        ? e.response?.data?.msg || e.message
        : String(e);
      toast.error(errorMsg);
      console.error("Submission error:", e);
    }
  }

  function handleCloseModal() {
    setOpenModal(false);
    setModalType("");
    setUserName("");
    setemail("");
    setpassword("");
    setrole("");
  }

  return (
    <article className="p-8 bg-slate-50 min-h-screen">
      <div
        className={`fixed ${openModal ? "block opacity-100 w-auto h-auto" : "hidden opacity-0 w-0 h-0"} z-10 h-screen top-0 left-0 right-0 grid place-items-center bg-slate-900/40 transition-all duration-300`}
      >
        <form
          onSubmit={handleModalSubmit}
          className="shadow-2xl bg-white rounded-xl p-8 w-full max-w-md relative border border-slate-200"
        >
          <div className="grid place-items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {modalType === "create"
                ? "Create User"
                : modalType === "update"
                  ? "Update User"
                  : ""}
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
                Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="john_doe"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={username}
                onChange={(e) => setUserName(e.currentTarget.value)}
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
                onChange={(e) => setemail(e.currentTarget.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password{" "}
                {modalType === "create" && (
                  <span className="text-rose-500">*</span>
                )}
              </label>
              <input
                type="password"
                placeholder={
                  modalType === "create"
                    ? "Enter password"
                    : "Leave empty to keep current"
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={password}
                onChange={(e) => setpassword(e.currentTarget.value)}
              />
            </div>

            {(modalType === "create" || modalType === "update") && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Role{" "}
                  {modalType === "create" && (
                    <span className="text-rose-500">*</span>
                  )}
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={role}
                  onChange={(e) => setrole(e.currentTarget.value)}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className={`w-full mt-6 text-white rounded-lg px-4 py-2.5 font-semibold transition-all duration-200 ${
                modalType === "create"
                  ? "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {modalType === "create"
                ? "Create User"
                : modalType === "update"
                  ? "Update User"
                  : ""}
            </button>
          </article>
        </form>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Users</h1>
        <p className="text-lg text-slate-600">
          Add, edit, and manage user accounts
        </p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Search Bar */}
          <div className="flex-1 w-full relative">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Create Button */}
          <button
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 active:scale-95"
            onClick={() => {
              setOpenModal(true);
              setModalType("create");
              setUserName("");
              setemail("");
              setpassword("");
              setrole("");
            }}
          >
            <FaPlus size={18} />
            Create User
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                          user.role,
                        )}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3">
                        <button
                          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium"
                          onClick={() => {
                            handleUpdate(user);
                            setOpenModal(true);
                            setModalType("update");
                          }}
                        >
                          <FaEdit size={14} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-slate-500">
            <p className="text-lg font-medium">
              No users found matching your search
            </p>
          </div>
        )}

        {/* Footer with User Count */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 text-sm text-slate-600">
          Showing <span className="font-semibold">{filteredUsers.length}</span>{" "}
          of <span className="font-semibold">{users.length}</span> users
        </div>
      </div>
    </article>
  );
}
