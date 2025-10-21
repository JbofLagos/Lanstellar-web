import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hook/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedUserTypes,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoadingUser } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B1E9F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user type is allowed (if specified)
  if (
    allowedUserTypes &&
    user &&
    !allowedUserTypes.includes(user.userType || "")
  ) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath =
      user.userType === "lender" ? "/lpdashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
