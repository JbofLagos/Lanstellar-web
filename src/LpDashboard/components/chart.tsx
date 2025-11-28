"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 2600 },
  { month: "Mar", value: 1900 },
  { month: "Apr", value: 2100 },
  { month: "May", value: 1800 },
  { month: "Jun", value: 2350 },
  { month: "Jul", value: 4840 },
  { month: "Aug", value: 2100 },
  { month: "Sep", value: 2900 },
  { month: "Oct", value: 2700 },
  { month: "Nov", value: 2300 },
  { month: "Dec", value: 2600 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#1A1A21",

          borderRadius: "8px",
          border: "1px solid #E4E3EC",
        }}
      >
        <p
          style={{
            color: "#8C94A6",
            margin: 0,
            fontSize: "10.34px",
            padding: "10px",
          }}
        >{`Date: ${label} 2024`}</p>
        <hr className=" border-t-[0.86px] border-[#49576D]" />
        <p
          style={{
            color: "#BBC0CA",
            margin: 0,
            fontWeight: 600,
            fontSize: "10.34px",
            padding: "10px",
          }}
        >
          Asset value: ${payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Chart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#F4F3F7" strokeWidth={0.5} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#8C94A6", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fill: "#8C94A6", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8872FD" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8872FD" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="linear"
            dataKey="value"
            stroke="#8872FD"
            strokeWidth={1.72}
            activeDot={{ r: 6 }}
             dot={{ r: 3, fill: "#8872FD" }}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
