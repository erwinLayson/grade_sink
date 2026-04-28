import { Navigate, Outlet } from "react-router-dom";

import useUser from "../hooks/useUser";

export default function ProtectedRoutes() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}
