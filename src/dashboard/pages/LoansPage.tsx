import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanOverview from "../components/loans/loan-overview";
import RepaymentSchedule from "../components/loans/repayment";

const LoansPage = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="text-[13px]">
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
  );
};

export default LoansPage;
