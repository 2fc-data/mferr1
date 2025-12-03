import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { NoZeroTooltip } from "../../../components/tooltip";

interface BarGraphProps {
  data: any;
  selectedYear?: string;
  filterLabel?: string;
  height?: number;
}

export const BarGraph: React.FC<BarGraphProps> = ({
  data,
  selectedYear,
  filterLabel,
  height = 330,
}) => {

  const normalizedData = useMemo(() => {
    return data ?? [];
  }, [data]);

  const chartColors = [
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
    "var(--chart-primary)",
    "var(--chart-secondary)",
    "var(--chart-aux-1)",
    "var(--chart-aux-2)",
    "var(--chart-aux-3)",
  ];

  return (
    <div className="text-lg font-bold text-black mb-3">
      <h3 className="text-lg font-semibold mb-4">{filterLabel} — {selectedYear}</h3>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={normalizedData}
          margin={{ top: 20, right: 20, left: 8, bottom: 5 }}
          barCategoryGap="15%"
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />

          <YAxis allowDecimals={false} />

          <Tooltip content={<NoZeroTooltip />} />

          <Bar
            dataKey="value"
            barSize={45}
            radius={[6, 6, 0, 0]}
          >
            {normalizedData.map((_: any, idx: number) => (
              <Cell
                key={`cell-${idx}`}
                fill={chartColors[idx % chartColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
