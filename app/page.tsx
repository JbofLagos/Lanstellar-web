import React from "react";
import Hero from "./components/hero";
import About from "./components/about";
import Footer from "./components/footer";
import HowItWorks from "./components/howItWorks";

const Page = () => {
  return (
    <div className=" bg-white">
      <Hero />
      <About />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Page;
