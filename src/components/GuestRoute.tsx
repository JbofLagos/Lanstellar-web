import { Navigate } from "react-router-dom";
import { useAuth } from "@/hook/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, user, isLoadingUser } = useAuth();

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

  // If user is authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    // Redirect based on user type
    const redirectPath = user?.userType === "lender" ? "/lpdashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, show the auth page (login/signup)
  return <>{children}</>;
};

