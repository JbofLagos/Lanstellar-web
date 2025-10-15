import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getNames } from "country-list";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

const Waitlist = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      try {
        const res = await api.post("/waitlist", {
          fullName: fullName,
          email: email,
          country: country,
          telegramUsername: telegramUsername,
        });
        console.log("Waitlist submission response:", res.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.info("Waitlist submission", {
          fullName,
          email,
          country,
          telegramUsername,
        });
      }

      toast.success("You're on the waitlist! We'll be in touch.");
      setFullName("");
      setEmail("");
      setCountry("");
      setTelegramUsername("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = getNames();

  return (
    <section id="waitlist" className="w-full bg-white font-inter">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-20">
        <div className="text-center space-y-3 mb-8">
          <div className="flex flex-col justify-center">
            <span className="text-[#969798] text-[12px] text-center">
              JOIN THE WAITLIST
            </span>
            <h2 className="text-[24px] sm:text-[32px] text-[#212121] font-bold text-center">
              Get early access to Lanstellar at launch.
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col flex-wrap w-full max-w-xl gap-3"
        >
          <div className="flex flex-row w-full max-w-xl gap-3">
            <Input
              placeholder="Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-[#F5F5F5] border border-[#F1F1F1] focus:outline-none rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none transition-colors"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#F5F5F5] border border-[#F1F1F1] focus:outline-none rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none transition-colors"
              aria-invalid={
                email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
              }
            />
          </div>
          <div className="flex flex-row w-full max-w-xl gap-3">
            <Select
              value={country}
              onValueChange={(value) => setCountry(value)}
            >
              <SelectTrigger className="bg-[#F5F5F5] border border-[#F1F1F1] rounded-[10px] text-[#1A1A1A] py-5.5 w-1/2 placeholder:text-[#CBCBCB]">
                <SelectValue
                  placeholder="Country"
                  className="placeholder:text-[#CBCBCB]"
                />
              </SelectTrigger>

              <SelectContent className="w-3/5">
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Telegram Username"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              className="bg-[#F5F5F5] border border-[#F1F1F1] focus:outline-none rounded-[10px] w-1/2 text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none transition-colors"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white py-2 rounded-md text-[16px] font-medium hover:opacity-90 transition-opacity mt-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Joining..." : "Join"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Waitlist;
