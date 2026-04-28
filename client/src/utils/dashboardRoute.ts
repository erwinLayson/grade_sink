import type { ROLE } from "../constant/user";

export function getDashboardRoute(role?: ROLE | string | null) {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "super_admin":
      return "/superadmin/dashboard";
    default:
      return null;
  }
}
