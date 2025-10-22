import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { useLogout } from "@/hook/useLogout";

const Navbar = () => {
  const { user } = useCurrentUser();
  const { logout } = useLogout();

  const handleConnectWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/privy/link");
      console.log(res);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="p-5 border-b border-b-[#E5E5E5] px-10 font-fredoka flex items-center justify-between">
      <div>
        <h2 className="text-[24px] text-[#49576D]">
          Welcome{" "}
          <span className="text-black">{user?.fullName || "Guest"} 👋,</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 justify-center">
        {/* Dropdown Menu - Entire section is clickable */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none cursor-pointer border-none bg-transparent flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex flex-row gap-2 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user?.profilePicture || ""}
                  alt="profile picture"
                  className="object-cover object-center"
                />
                <AvatarFallback>{user?.companyName?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 items-start">
                <p className="text-sm font-medium text-[#1A1A21]">
                  {user?.fullName || "Guest"}
                </p>
                <p className="text-xs text-[#8C94A6] truncate">
                  {user?.companyEmail || user?.email || ""}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-[220px] p-2 shadow-lg border border-[#E4E3EC] rounded-lg bg-white"
          >
            {/* User Info Section */}
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-[#1A1A21]">
                {user?.fullName || "Guest"}
              </p>
              <p className="text-xs text-[#8C94A6] truncate">
                {user?.companyEmail || user?.email || ""}
              </p>
            </div>

            <DropdownMenuSeparator className="bg-[#E4E3EC]" />

            <DropdownMenuItem asChild>
              <Link
                to="/dashboard/settings"
                className="flex w-full items-center px-3 py-2 text-[14px] text-[#49576D] rounded-md hover:bg-[#F4F3F7] cursor-pointer transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </Link>
            </DropdownMenuItem>

            {!user?.walletAddress && (
              <DropdownMenuItem
                onClick={handleConnectWallet}
                className="flex w-full items-center px-3 py-2 text-[14px] text-[#49576D] rounded-md hover:bg-[#F4F3F7] cursor-pointer transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Connect Wallet
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="bg-[#E4E3EC]" />

            <DropdownMenuItem
              onClick={logout}
              className="flex w-full items-center px-3 py-2 text-[14px] text-red-600 rounded-md hover:bg-red-50 cursor-pointer transition-colors"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
