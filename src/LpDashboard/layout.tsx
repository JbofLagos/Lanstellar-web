import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const LpDashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-white font-inter ">
      <aside className="flex-shrink-0 sticky top-0 h-screen z-20">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex-shrink-0 sticky top-0 z-10">
          <Navbar />
        </header>

        <main className="flex-1 overflow-y-auto bg-white">
          <div className=" mx-auto">{children}</div>
        <ConnectWalletButton />
        </main>
      </div>
    </div>
  );
};

export default LpDashboardLayout;
