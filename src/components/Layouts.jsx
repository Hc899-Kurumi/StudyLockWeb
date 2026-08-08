import { Navigate, Outlet, useLocation } from "react-router-dom";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import { Spinner } from "./ui";
import { useAuth } from "../context/AuthContext";

export function PublicLayout() {
  return (
    <>
      <PublicNav />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}

export function ProtectedRoute() {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Checking your session" />;

  // Without Firebase config there's no auth; send people to login where a
  // setup notice explains what to do.
  if (!configured) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
