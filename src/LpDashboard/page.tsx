import Analytics from "./components/analytics";

const LpDashboardPage = () => {
  return (
    <div className="font-inter space-y-[27px] p-6">
      <div className="flex flex-row justify-between items-center mb-6">
        <span className="text-[15.5px] text-black gap-2 flex items-center font-medium">
          <img
            src="/icons/balance.svg"
            alt="balance"
            className="text-[#8C94A6] w-[20.67px] h-[20.67px]"
          />
          Credit Balance
        </span>
        <span className="font-semibold text-[15.5px]">$0.0</span>
      </div>

      {/* Analytics */}
      <div>
        <Analytics />
      </div>
    </div>
  );
};

export default LpDashboardPage;
