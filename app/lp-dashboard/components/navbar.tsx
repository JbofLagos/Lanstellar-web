import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className=" p-5 border-b border-b-[#E5E5E5] px-10 font-fredoka  flex items-center justify-between">
      <div className="">
        {" "}
        <h2 className=" text-[25.84px] text-[#49576D]">
          Welcome <span className=" text-black">Test👋,</span>
        </h2>
      </div>
      <div className="flex items-center gap-2 justify-center w-[156px] h-[34.5px] ">
        <div className="">
          <Link href="/dashboard/account">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className=" flex flex-row gap-1 items-center ">
          <div className="bg-gradient-to-r from-[#468FF7] to-[#844CCB] p-[1px] flex justify-center items-center rounded-full">
            <div className="   bg-white rounded-full h-[26px] w-[91px] flex justify-center items-center px-3 mx-auto">
              <h2 className=" text-transparent bg-gradient-to-r from-[#468FF7] to-[#844CCB] bg-clip-text text-[12.6px] ">
                0xb1....5678
              </h2>
            </div>
          </div>
          <div className="cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none cursor-pointer border-none bg-transparent flex items-center justify-center">
                <ChevronDownIcon className="text-[#8C94A6]" size={18} />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-[180px] p-2 shadow-lg border border-[#E4E3EC] rounded-lg bg-white">
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/account"
                    className="flex w-full items-center px-3 py-2 text-[14px] text-[#49576D] rounded-md hover:bg-[#F4F3F7]  cursor-pointer transition-colors"
                  >
                    Account
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/settings"
                    className="flex w-full items-center px-3 py-2 text-[14px] text-[#49576D] rounded-md hover:bg-[#F4F3F7]  cursor-pointer transition-colors"
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="flex w-full items-center px-3 py-2 text-[14px] text-red-600 rounded-md hover:bg-red-50  cursor-pointer transition-colors"
                  >
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
