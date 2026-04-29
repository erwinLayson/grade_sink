import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";

// Components
import MasterLayout from "./components/shared/MasterLayout";

// Context
import UserContextProvider from "./context/userContext";
import SideBarProvider from "./context/sideBarContext";
import GetUserProvider from "./context/getUserContext";

// Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// teacher
import { Grades } from "./pages/teachers/Grades";
import TeacherDashboard from "./pages/TeacherDashboard";
import GradeManagement from "./pages/GradeManagement";
import MyClasses from "./pages/teachers/MyClasses";
import TeacherProfile from "./pages/teachers/Profile";

// super Admin
import {
  AdminDashboard,
  ManageClasses,
  ManageUser,
  ManageTeachers,
  ManageStudents,
  ManageSubjects,
  SuperAdminDashboard,
} from "./pages/admin";
import ActivityLogs from "./pages/superAdmin/ActivityLogs";

export default function App() {
  return (
    <UserContextProvider>
      <GetUserProvider>
        <SideBarProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                element={
                  <ProtectedRoutes allowedRoles={["admin", "super_admin"]} />
                }
              >
                <Route path="/" element={<MasterLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/manage-users" element={<ManageUser />} />
                  <Route path="/manage-classes" element={<ManageClasses />} />
                  <Route path="/manage-teachers" element={<ManageTeachers />} />
                  <Route path="/manage-students" element={<ManageStudents />} />
                  <Route path="/manage-subjects" element={<ManageSubjects />} />
                </Route>
              </Route>

              <Route
                element={<ProtectedRoutes allowedRoles={["super_admin"]} />}
              >
                <Route path="/" element={<MasterLayout />}>
                  <Route
                    path="/superadmin/dashboard"
                    element={<SuperAdminDashboard />}
                  />
                  <Route
                    path="/super-admin/activity-logs"
                    element={<ActivityLogs />}
                  />
                </Route>
              </Route>

              <Route element={<ProtectedRoutes allowedRoles={["teacher"]} />}>
                <Route path="/" element={<MasterLayout />}>
                  <Route
                    path="/teacher/dashboard"
                    element={<TeacherDashboard />}
                  />
                  <Route path="/teacher/my-classes" element={<MyClasses />} />
                  <Route path="/teacher/profile" element={<TeacherProfile />} />
                  <Route
                    path="/grade-management"
                    element={<GradeManagement />}
                  />
                  <Route path="/grades" element={<Grades />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </SideBarProvider>
      </GetUserProvider>
    </UserContextProvider>
  );
}
