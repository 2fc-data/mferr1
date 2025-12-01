import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineGraphProps {
  monthlyData: any;
  filtros: string[]; // lista de chaves/series
  selectedYear?: string;
  height?: number;
}

export const LineGraph: React.FC<LineGraphProps> = ({
  monthlyData,
  filtros,
  selectedYear,
  height = 340,
}) => {
  const chartColors = [
    "var(--chart-primary)",
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
    "var(--chart-secondary)",
    "var(--chart-aux-1)",
    "var(--chart-aux-2)",
    "var(--chart-aux-3)",
  ];
  const colorFor = (idx: number) => chartColors[idx % chartColors.length];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Desfechos por mês — {selectedYear}</h3>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v: any) => (typeof v === "number" ? v : v)} />
            <Legend />

            {filtros.map((filtro, i) => (
              <Line
                key={filtro}
                type="monotone"
                dataKey={filtro}
                stroke={colorFor(i)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
