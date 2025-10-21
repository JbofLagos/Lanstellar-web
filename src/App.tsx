import { Routes, Route } from "react-router-dom";
import About from "./ui/about";
import Footer from "./ui/footer";
import Hero from "./ui/hero";
import HowItWorks from "./ui/howItWorks";
import Navbar from "./ui/navbar";
import Waitlist from "./ui/waitlist";
import DashboardLayout from "./dashboard/layout";
import DashboardPage from "./dashboard/page";
import AssetsPage from "./dashboard/pages/AssetsPage";
import LoansPage from "./dashboard/pages/LoansPage";
import SettingsPage from "./dashboard/pages/SettingsPage";
import LoginPage from "./(auth)/Login";
import LpDashboardLayout from "./LpDashboard/layout";
import LpDashboardPage from "./LpDashboard/page";
import ExpectedPage from "./LpDashboard/pages/ExpectedROI";
import LoanPage from "./LpDashboard/pages/Loans";
import RegisterPage from "./(auth)/Signup";
import UserTypePage from "./(auth)/UserSelection";
import Informations from "./(auth)/Informations";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";

const HomePage = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Waitlist />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Guest Routes - Redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/usertype"
        element={
          <GuestRoute>
            <UserTypePage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* Protected Routes - Requires Authentication */}
      <Route
        path="/setup-profile"
        element={
          <ProtectedRoute>
            <Informations />
          </ProtectedRoute>
        }
      />

      {/* Borrower Dashboard Routes - Only for borrower user type */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedUserTypes={["borrower"]}>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/assets"
        element={
          <ProtectedRoute allowedUserTypes={["borrower"]}>
            <DashboardLayout>
              <AssetsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/loans"
        element={
          <ProtectedRoute allowedUserTypes={["borrower"]}>
            <DashboardLayout>
              <LoansPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute allowedUserTypes={["borrower"]}>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Lender Dashboard Routes - Only for lender user type */}
      <Route
        path="/lpdashboard"
        element={
          <ProtectedRoute allowedUserTypes={["lender"]}>
            <LpDashboardLayout>
              <LpDashboardPage />
            </LpDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lpdashboard/expected"
        element={
          <ProtectedRoute allowedUserTypes={["lender"]}>
            <LpDashboardLayout>
              <ExpectedPage />
            </LpDashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lpdashboard/loans"
        element={
          <ProtectedRoute allowedUserTypes={["lender"]}>
            <LpDashboardLayout>
              <LoanPage />
            </LpDashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
