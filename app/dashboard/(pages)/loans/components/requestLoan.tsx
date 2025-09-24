"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const RequestLoan = () => {
  const [plan, setPlan] = React.useState<string>("one");

  return (
    <div>
      <DialogContent className="w-fit border-[4px] border-[#F8F8F8] rounded-[20px] ">
        <DialogHeader>
          <DialogTitle className=" text-[20px] font-semibold text-black">
            Request loan
          </DialogTitle>
        </DialogHeader>
        <div className=" space-y-2">
          <div className="grid gap-1.5">
            <Label
              htmlFor="purpose"
              className=" text-[13.78px] font-medium text-[#1A1A21]"
            >
              Purpose of loan
            </Label>
            <Input
              id="purpose"
              name="purpose"
              placeholder="What do you need the loan for?"
              className=" w-[454px] h-[37px] rounded-[10px] border-[1px] border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#CBCBCB]"
            />
          </div>

          <div className="grid gap-1.5">
            <Label
              htmlFor="collateral"
              className=" text-[13.78px] font-medium text-[#1A1A21]"
            >
              Select Eligible Collateral
            </Label>
            <Select>
              <SelectTrigger className="w-full h-[37px] rounded-[10px] border-[1px] border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#CBCBCB] shadow-none">
                <SelectValue placeholder="Select asset from your list of collateral " />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label
              htmlFor="amount"
              className=" text-[13.78px] font-medium text-[#1A1A21]"
            >
              Amount Needed
            </Label>
            <Input
              id="amount"
              name="amount"
              placeholder="Enter amount ($)"
              className=" w-[454px] h-[37px] rounded-[10px] border-[1px] border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#CBCBCB]"
            />
            <span className=" text-[#A19821] font-medium text-[12px]">
              *Amount must be at max of 30% of asset value
            </span>
          </div>

          <div className="grid gap-1.5">
            <Label
              htmlFor="duration"
              className=" text-[13.78px] font-medium text-[#1A1A21]"
            >
              Select Loan Duration
            </Label>
            <Select>
              <SelectTrigger className="w-full h-[37px] rounded-[10px] border-[1px] border-[#F1F1F1] bg-[#F5F5F5] px-3 py-2 text-[13.78px] font-medium text-[#CBCBCB] shadow-none">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="12m">12 Months</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Repayment plan picker inline */}
          <div className="grid gap-1.5">
            <Label className=" text-[13.78px] font-medium text-[#1A1A21]">
              Select Repayment Plan
            </Label>
            <RadioGroup
              value={plan}
              onValueChange={setPlan}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {[
                { id: "one", installments: 1, percent: 5 },
                { id: "two", installments: 2, percent: 10 },
                { id: "three", installments: 3, percent: 15 },
              ].map((p) => (
                <label
                  key={p.id}
                  htmlFor={`plan-${p.id}`}
                  className={cn(
                    "cursor-pointer",
                    "block rounded-lg border bg-card text-card-foreground shadow-sm transition-all ",
                    "hover:shadow-md",
                    plan === p.id
                      ? "border-[#5B1E9F] ring-[1px] ring-[#5B1E9F]"
                      : "border-muted"
                  )}
                >
                  <Card className="border-0 bg-transparent shadow-none h-[64px] w-[112px] p-0">
                    <CardContent className="flex h-full w-full items-center justify-center p-0">
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground">
                          ({p.percent}%)
                        </span>
                        <div className="text-[13.78px] whitespace-nowrap font-medium">
                          {p.installments}{" "}
                          {p.installments === 1
                            ? "installment"
                            : "installments"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <RadioGroupItem
                    id={`plan-${p.id}`}
                    value={p.id}
                    className="sr-only"
                  />
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-gradient-to-r from-[#439EFF] to-[#5B1E9F] text-white px-4 py-2 rounded-[10px] flex items-center gap-2 w-full">
            Request Loan
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default RequestLoan;
