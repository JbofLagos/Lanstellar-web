import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hook/useAuth";
import { type User } from "@/lib/api-service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
  skipProfileCheck?: boolean;
}

// Helper function to check if user profile is complete
const isProfileComplete = (user: User | null | undefined): boolean => {
  if (!user) return false;

  // For borrowers, check if they have companyName
  if (user.userType === "borrower") {
    return !!user.companyName;
  }

  // For lenders, check if they have username
  if (user.userType === "lender") {
    return !!user.username;
  }

  return false;
};

export const ProtectedRoute = ({
  children,
  allowedUserTypes,
  skipProfileCheck = false,
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

  // Check if profile is complete (unless skipProfileCheck is true)
  if (!skipProfileCheck && !isProfileComplete(user)) {
    return <Navigate to="/setup-profile" replace />;
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
