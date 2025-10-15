import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LoanAllocation = () => {
  return (
    <div>
      <Card className="border-[1px] border-[#FAFAFF] rounded-[10px] shadow-none p-[20px] gap-2 w-[392px] h-[189px]">
        <CardHeader className="flex flex-row justify-between text-[15.5px] p-0 text-[#1A1A21] font-semibold">
          <span>% in Loan Allocation Overview</span>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default LoanAllocation;
