import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between h-[87px] md:px-[100px] px-4 fixed top-0 left-0 right-0 bg-[#151515]/3 backdrop-blur-[2px] z-50">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="logo"
          width={120}
          height={40}
          className="
           
      w-32 h-10   
      md:w-40 md:h-12   
      lg:w-48 lg:h-14   
      xl:w-56 xl:h-16   
      transition-all duration-300 ease-in-out
      hover:scale-105
    "
        />
      </div>

      <nav className=" md:flex hidden">
        <ul className="flex gap-[40px] font-inter  text-[18px] font-medium text-[#f4f3f7]">
          <li className="cursor-pointer">Demo</li>
          <li className="cursor-pointer">Features</li>
          <li className="cursor-pointer">Contact</li>
        </ul>
      </nav>

      <div>
        <div className="flex gap-5 z-50">
          <Button className="bg-white hover:bg-white/90 cursor-pointer text-black rounded-full md:px-6 font-inter md:py-6  md:text-[16px] font-medium">
            Launch App
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-white/90 cursor-pointer  rounded-full md:px-6 font-inter md:py-6   md:text-[16px] font-medium">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
