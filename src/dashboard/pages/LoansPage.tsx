import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanOverview from "../components/loans/loan-overview";
import RepaymentSchedule from "../components/loans/repayment";
import RequestLoanDialog from "../components/loans/request-loan-dialog";

const LoansPage = () => {
  return (
    <div className="">
      <div>
        <div className=" flex justify-between items-center border-b-[1px] border-[#F4F3F7] p-4 mb-4">
          <div className="bg-[#F7F7F8]  whitespace-nowrap text-[13.78px] text-[#8C94A6]  w-fit h-[37px] rounded-[10px] flex items-center gap-2 px-3  border-[1px] border-[#F4F3F7]">
            <img
              src="/icons/filter.svg"
              alt="Description of the image"
              width={16}
              height={16}
            />
            Sorted by <span className=" text-[#1A1A21]">Date added</span>
          </div>
          <div className="">
            <RequestLoanDialog />
          </div>
        </div>
      </div>
      <div className=" p-6">
        <Tabs defaultValue="overview">
          <TabsList className=" text-[13px]">
            <TabsTrigger value="overview" className=" text-[13px]">
              Loan Overview
            </TabsTrigger>
            <TabsTrigger value="repayment" className=" text-[13px]">
              Repayment Schedule
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="cursor-pointer">
            <LoanOverview />
          </TabsContent>
          <TabsContent value="repayment" className="cursor-pointer">
            <RepaymentSchedule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoansPage;
