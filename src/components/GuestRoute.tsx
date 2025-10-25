import { Navigate } from "react-router-dom";
import { useAuth } from "@/hook/useAuth";
import { type User } from "@/lib/api-service";

interface GuestRouteProps {
  children: React.ReactNode;
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

  // If user is authenticated, redirect based on profile completion
  if (isAuthenticated) {
    // Check if profile is complete
    if (!isProfileComplete(user)) {
      return <Navigate to="/setup-profile" replace />;
    }

    // Redirect to appropriate dashboard based on user type
    const redirectPath =
      user?.userType === "lender" ? "/lpdashboard" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, show the auth page (login/signup)
  return <>{children}</>;
};
