import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { colorForGraphs } from "../../../utils/colorForGraphs";
// import { type ClientData } from "../../../types/ClientData.int erface";

type BarData = { name: string; value: number, height?: number; };

interface BarGraphProps {
  data: BarData[];
  selectedYear: string;
  height?: number;
}

export const BarGraph: React.FC<BarGraphProps> = ({ 
  data,   
  selectedYear,
  height = 350
}) => {
  console.log(data);

  const prepared = useMemo(() => data ?? [], [data]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Desfechos — {selectedYear}</h3>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={prepared} margin={{ top: 12, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Quantidade">
              {prepared.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorForGraphs(entry.name, index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
