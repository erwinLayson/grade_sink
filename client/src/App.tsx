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

// teacher
import { Grades } from "./pages/teachers/Grades";
import TeacherDashboard from "./pages/TeacherDashboard";
import GradeManagement from "./pages/GradeManagement";

// super Admin
import { AdminDashboard, ManageClasses, ManageUser } from "./pages/superAdmin";
import ManageTeachers from "./pages/superAdmin/ManageTeachers";
import ManageStudents from "./pages/superAdmin/ManageStudents";
import ManageSubjects from "./pages/superAdmin/ManageSubjects";

export default function App() {
  return (
    <UserContextProvider>
      <GetUserProvider>
        <SideBarProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<MasterLayout />}>
                  {/* super admin routes */}
                  <Route
                    path="/superadmin/dashboard"
                    element={<AdminDashboard />}
                  />
                  <Route path="/manage-users" element={<ManageUser />} />
                  <Route path="/manage-classes" element={<ManageClasses />} />
                  <Route path="/manage-teachers" element={<ManageTeachers />} />
                  <Route path="/manage-students" element={<ManageStudents />} />
                  <Route path="/manage-subjects" element={<ManageSubjects />} />

                  {/* teacher Routes */}
                  <Route
                    path="/teacher-dashboard"
                    element={<TeacherDashboard />}
                  />
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
