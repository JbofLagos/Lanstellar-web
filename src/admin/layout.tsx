import type { ReactNode } from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
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

export default AdminLayout;
