import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const LpDashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white font-inter ">
      <aside className="flex-shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0">
          <Navbar />
        </header>

        <main className="flex-1 overflow-y-auto bg-white ">
          <div className=" mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default LpDashboardLayout;
