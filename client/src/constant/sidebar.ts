import { FaHome, FaGraduationCap, FaBook, FaUsers, FaChalkboard, FaUserEdit } from "react-icons/fa";
import type { IconType } from "react-icons";

export type NavItem = {
  path: string;
  label: string;
  icon?: IconType;
};

export type SideBarProps = {
  teacher: NavItem[];
  admin: NavItem[];
  super_admin: NavItem[];
};

export const DEFAULT_NAV_CONFIG: SideBarProps = {
  teacher: [
    { path: "/teacher/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/teacher/my-classes", label: "My Classes", icon: FaBook },
    { path: "/grade-management", label: "Grade Management", icon: FaGraduationCap },
    { path: "/teacher/profile", label: "Profile", icon: FaUserEdit },
  ],
  admin: [
    { path: "/admin/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/manage-teachers", label: "Manage Teachers", icon: FaChalkboard },
    { path: "/manage-students", label: "Manage Students", icon: FaUsers },
    { path: "/manage-classes", label: "Manage Classes", icon: FaBook },
    { path: "/manage-subjects", label: "Manage Subjects", icon: FaBook },
  ],
  super_admin: [
    { path: "/superadmin/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/manage-users", label: "Manage Users", icon: FaUsers },
    { path: "/manage-teachers", label: "Manage Teachers", icon: FaChalkboard },
    { path: "/manage-students", label: "Manage Students", icon: FaUsers },
    { path: "/manage-classes", label: "Manage Classes", icon: FaBook },
    { path: "/manage-subjects", label: "Manage Subjects", icon: FaBook },
  ],
};