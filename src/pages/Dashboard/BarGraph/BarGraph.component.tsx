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

interface BarGraphProps {
  data: { name: string; value: number }[];
  year: string;
  barColor?: string;
  height?: number;
}

export const BarGraph: React.FC<BarGraphProps> = ({
  data,
  year,
  height = 360,
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
    <div style={{ width: "100%", height }}>
      <div className="text-lg font-bold text-gray-400 mb-3">
        <span className="text-primary"> Desfechos - {year}</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
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

          <Tooltip
            formatter={(val) =>
              typeof val === "number"
                ? val.toLocaleString("pt-BR")
                : val
            }
          />

          <Bar
            dataKey="value"
            barSize={45}
            radius={[6, 6, 0, 0]}
          >
            {normalizedData.map((_, idx) => (
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
