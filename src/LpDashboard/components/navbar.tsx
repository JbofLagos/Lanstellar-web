import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  fullName: string;
  email: string;
  profilePicture?: string;
  walletAddress?: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        console.log(data.data.user);
        setUser(data.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, []);

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
        <h2 className="text-[25.84px] text-[#49576D]">
          Welcome{" "}
          <span className="text-black">{user?.fullName || "Guest"} 👋,</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 justify-center w-[156px] h-[34.5px] ">
        <Link to="/dashboard/account">
          <Avatar>
            <AvatarImage
              src={user?.profilePicture || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>{user?.fullName?.[0] || "A"}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-row gap-1 items-center">
          {user?.walletAddress ? (
            <div className="bg-gradient-to-r from-[#468FF7] to-[#844CCB] p-[1px] flex justify-center items-center rounded-full">
              <div className="bg-white rounded-full h-[26px] w-[91px] flex justify-center items-center px-3 mx-auto">
                <h2 className="text-transparent bg-gradient-to-r from-[#468FF7] to-[#844CCB] bg-clip-text text-[12.6px]">
                  {user.walletAddress.slice(0, 4)}...
                  {user.walletAddress.slice(-4)}
                </h2>
              </div>
            </div>
          ) : (
            <div className="">
              <button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-[#468FF7] to-[#844CCB]  p-[1px] h-[28px] w-[100px] cursor-pointer text-white font-inter font-medium text-xs flex justify-center items-center rounded-full"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none cursor-pointer border-none bg-transparent flex items-center justify-center">
              <ChevronDownIcon className="text-[#8C94A6]" size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-[180px] p-2 shadow-lg border border-[#E4E3EC] rounded-lg bg-white">
              <DropdownMenuItem asChild>
                <Link
                  to="/lpdashboard/account"
                  className="flex w-full items-center px-3 py-2 text-[14px] text-[#49576D] rounded-md hover:bg-[#F4F3F7] cursor-pointer transition-colors"
                >
                  Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to="/lpdashboard/settings"
                  className="flex w-full items-center px-3 py-2 text-[14px] text-[#49576D] rounded-md hover:bg-[#F4F3F7] cursor-pointer transition-colors"
                >
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex w-full items-center px-3 py-2 text-[14px] text-red-600 rounded-md hover:bg-red-50 cursor-pointer transition-colors">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
