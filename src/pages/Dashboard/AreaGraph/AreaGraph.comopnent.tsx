// src/components/AreaGraph/AreaGraph.component.tsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { GraphTooltip } from "../../../components/tooltip";

interface AreaGraphProps {
  data: any[];       // array de 12 objetos { month: 'Jan', '2025': 12, '2024': 5, ... }
  years: string[];   // lista de anos (ex: ['2025','2024','2023'])
  height?: number;
  title?: string;
}

export const AreaGraph: React.FC<AreaGraphProps> = ({
  data = [],
  years = [],
  height = 360,
  title = "Comparativo anual (últimos 3 anos)",
}) => {
  const chartColors = [
    "var(--chart-primary)",
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
  ];

  const colorFor = (idx: number) => chartColors[idx % chartColors.length];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />            
            <Tooltip content={<GraphTooltip />} />
            <Legend />

            {years.map((yr, i) => (
              <Area
                key={yr}
                type="monotone"
                dataKey={yr}
                name={yr}
                stroke={colorFor(i)}
                fill={colorFor(i)}
                fillOpacity={0.25}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
