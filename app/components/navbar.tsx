import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-[87px] md:px-[100px] px-10 fixed top-0 left-0 right-0 bg-[#151515]/3 backdrop-blur-[2px] z-50">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={170}
          height={60}
          className="w-32 h-10 md:w-40 md:h-12 lg:w-48 lg:h-14 xl:w-56 xl:h-16 transition-all duration-300 ease-in-out hover:scale-105"
        />
      </div>

      <nav className=" md:flex hidden">
        <ul className="flex gap-[40px] font-inter  text-[18px] font-medium text-[#f4f3f7]">
          <li className="cursor-pointer">Demo</li>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Contact</li>
        </ul>
      </nav>

      <div className="md:gap-5 gap-2 flex">
        <Link href={"/user-selection"}>
          <Button className="bg-white mr-2 hover:bg-white/90 cursor-pointer text-black rounded-full px-2 font-inter md:h-[56px] h-[40px]  md:w-[190px] w-[150px] md:text-[16px] text-[14px] font-medium">
            Launch App
          </Button>
        </Link>
        <Button className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white hover:bg-white/90 cursor-pointer  md:px-6 px-2 font-inter md:w-[190px] w-[150px] md:text-[16px] text-[14px] rounded-full  md:h-[56px] h-[40px]  font-medium">
          Request a Demo
        </Button>
      </div>
    </div>
  );
};
export default Navbar;
