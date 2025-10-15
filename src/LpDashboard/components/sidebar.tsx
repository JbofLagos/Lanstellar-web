import { useState } from "react";
import { ChevronRight, CircleAlert } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || "";
  const [activeItem, setActiveItem] = useState(currentPath);

  const menuItems = [
    { id: "", label: "Dashboard", icon: "/icons/dashboard.svg" },
    { id: "loans", label: "Loans", icon: "/icons/wallet-minus.svg" },
    {
      id: "expected",
      label: "Expected ROI",
      icon: "/percentage-square.svg",
    },
    { id: "settings", label: "Settings", icon: "/icons/setting.svg" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <div
      className={`bg-white font- border-r font-inter border-[#E4E3EC] text-[#49576D h-full transition-all duration-300 ease-in-out flex flex-col  ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-6 border-b border-[#E4E3EC] flex items-center justify-between">
        {!isCollapsed && (
          <img
            src="/logo3.svg"
            alt="Logo"
            className="object-contain w-[132px] h-[32px]"
          />
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg  cursor-pointer transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <img
              src="/icons/collapse.svg"
              alt="Logo"
              className="w-[18px] h-[18px] object-contain"
            />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <Link to={`/lpdashboard/${item.id}`}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={` cursor-pointer whitespace-nowrap flex items-center px-3 h-[34px] w-[231px] rounded-[3.45px] transition-colors ${
                      isActive ? "bg-[#F7F7F8] text-[#49576D" : " text-[#49576D"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <img
                      src={item.icon}
                      alt="Logo"
                      className="object-contain w-[14.75px] h-[14.75px]"
                    />{" "}
                    {!isCollapsed && (
                      <div className=" flex flex-row items-center w-full justify-between">
                        <span className="ml-3 text-[12.06px] text-[#49576D] font-medium leading-[12.06px]">
                          {item.label}
                        </span>
                        {isActive && (
                          <ChevronRight
                            size={15}
                            className="ml-auto text-[#8C94A6]
                          "
                            strokeWidth={1.5}
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

      <div className=" p-4">
        <div className="flex items-center ">
          <CircleAlert
            size={25}
            className="text-[#8C94A6] w-[14.75px] h-[14.75px]"
            strokeWidth={1.5}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <span className="ml-3 text-[12.06px] text-[#49576D] font-medium leading-[12.06px]">
                Help
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
