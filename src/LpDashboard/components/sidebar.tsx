import { useState } from "react";
import {
  ChevronRight,
  CircleAlert,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: "", label: "Dashboard", icon: LayoutDashboard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if a menu item is active based on current URL
  const isItemActive = (itemId: string) => {
    const basePath = "/lpdashboard";
    const fullPath = itemId ? `${basePath}/${itemId}` : basePath;
    // Exact match for dashboard, startsWith for nested routes
    return itemId === ""
      ? location.pathname === basePath || location.pathname === `${basePath}/`
      : location.pathname.startsWith(fullPath);
  };

  return (
    <div
      className={`bg-[#010101] font-inter border-r border-[#1A1A1A] text-white h-screen transition-all duration-300 ease-in-out flex flex-col sticky top-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="py-6 px-3 border-b border-[#1A1A1A] flex items-center justify-between">
        {!isCollapsed && (
          <img src="/logo.svg" alt="Logo" className="object-contain w-30" />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-white/10 text-white/60 hover:text-white"
        >
          <ChevronRight
            size={18}
            className={`transition-transform duration-300 ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isItemActive(item.id);
            const IconComponent = item.icon;

            return (
              <li key={item.id}>
                <Link to={`/lpdashboard/${item.id}`}>
                  <button
                    className={`cursor-pointer whitespace-nowrap flex items-center px-3 h-[40px] w-full rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#5B1E9F] to-[#5B1E9F]/80 text-white shadow-lg shadow-[#5B1E9F]/20"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <IconComponent
                      className={`w-[18px] h-[18px] flex-shrink-0 ${
                        isActive ? "text-white" : ""
                      }`}
                      strokeWidth={1.8}
                    />
                    {!isCollapsed && (
                      <div className="flex flex-row items-center w-full justify-between">
                        <span
                          className={`ml-3 text-[13px] font-medium ${
                            isActive ? "text-white" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <ChevronRight
                            size={16}
                            className="ml-auto text-white/80"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                    )}
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#1A1A1A]">
        <button className="flex items-center w-full px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors">
          <CircleAlert size={18} className="flex-shrink-0" strokeWidth={1.8} />
          {!isCollapsed && (
            <span className="ml-3 text-[13px] font-medium">Help</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
