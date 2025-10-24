import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignup } from "@/hook/useSignup";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, loading } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    const userTypeParam = searchParams.get("userType");
    if (userTypeParam) {
      setValue("userType", userTypeParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: SignupFormData) => {
    await signup(data);
  };

  return (
    <div className="h-screen bg-[url('/heropatern.svg')] bg-white/70 bg-blend-overlay font-inter justify-center relative items-center flex flex-col bg-center bg-cover">
      <div className="self-start ml-[20px] z-50 mt-[10px] top-0 left-0 absolute">
        <img src={"/logo3.svg"} height={48} width={174} alt="logo" />
      </div>
      <div className="flex justify-center items-center ">
        <div className="space-y-5 flex justify-center flex-col p-[30px] bg-[#FCFCFC] border border-[#E4E3EC] border-dashed rounded-[20px] min-h-[520px] w-[543px]">
          <div>
            <h2 className="font-inter font-semibold text-[20px]">
              Create an Account 🚀
            </h2>
            <p className="text-[#8C94A6] text-[13.78px] font-medium">
              Fill in your details to get started
            </p>
          </div>
          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Email
              </Label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
                className={`bg-[#F5F5F5] border rounded-[10px] text-[#1A1A1A] placeholder:text-[#CBCBCB] shadow-none p-3 h-12 outline-none ${
                  errors.email ? "border-red-500" : "border-[#F1F1F1]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <input
              type="hidden"
              {...register("userType", { required: "User type is required" })}
            />

            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Password
              </Label>
              <div className="flex relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                      message:
                        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
                    },
                  })}
                  placeholder="Enter password"
                  className={`bg-[#F5F5F5] border text-sm rounded-[10px] text-[#1A1A21] placeholder:text-[#CBCBCB] p-3 h-12 w-full outline-none ${
                    errors.password ? "border-red-500" : "border-[#F1F1F1]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-[#F4F3F7] bg-[#FFFFFF] rounded-[10px] text-[#CBCBCB] text-sm px-2"
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[#1A1A21] text-[13.78px] font-medium">
                Confirm Password
              </Label>
              <div className="flex relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
                  className={`bg-[#F5F5F5] border text-sm rounded-[10px] text-[#1A1A21] placeholder:text-[#CBCBCB] p-3 h-12 w-full outline-none ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#F1F1F1]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 border border-[#F4F3F7] bg-[#FFFFFF] rounded-[10px] text-[#CBCBCB] text-sm px-2"
                >
                  {showConfirmPassword ? "hide" : "show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-[#439EFF] to-[#5B1E9F] text-white py-2 rounded-md text-[16px] font-medium hover:opacity-90 transition-opacity mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
            <hr className="border-t border-t-[#CBCBCB]/70" />
            <p className="text-center text-[#8C94A6] text-[13.78px] font-medium">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#5B1E9F] cursor-pointer"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
