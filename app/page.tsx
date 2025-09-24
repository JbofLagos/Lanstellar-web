import React from "react";
import Hero from "./components/hero";
import About from "./components/about";
import Footer from "./components/footer";
import HowItWorks from "./components/howItWorks";
import Navbar from "./components/navbar";
import Waitlist from "./components/waitlist";

const Page = () => {
  return (
    <div className=" bg-white">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Waitlist />
      <Footer />
    </div>
  );
};

export default Page;
