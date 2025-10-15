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
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/usertype" element={<UserTypePage />} />
      <Route path="/informations" element={<Informations />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/lpdashboard"
        element={
          <LpDashboardLayout>
            <LpDashboardPage />
          </LpDashboardLayout>
        }
      />
      <Route
        path="/lpdashboard/expected"
        element={
          <LpDashboardLayout>
            <ExpectedPage />
          </LpDashboardLayout>
        }
      />
      <Route
        path="/lpdashboard/loans"
        element={
          <LpDashboardLayout>
            <LoanPage />
          </LpDashboardLayout>
        }
      />
      <Route
        path="/dashboard/assets"
        element={
          <DashboardLayout>
            <AssetsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/loans"
        element={
          <DashboardLayout>
            <LoansPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default App;
