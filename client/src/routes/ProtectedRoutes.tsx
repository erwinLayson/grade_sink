import { Navigate, Outlet } from "react-router-dom";

import useUser from "../hooks/useUser";
import type { ROLE } from "../constant/user";
import { getDashboardRoute } from "../utils/dashboardRoute";

type ProtectedRoutesProps = {
  allowedRoles?: ROLE[];
};

export default function ProtectedRoutes({
  allowedRoles,
}: ProtectedRoutesProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboardRoute = getDashboardRoute(user.role);

    if (dashboardRoute) {
      return <Navigate to={dashboardRoute} replace />;
    }

    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
}
