// src/components/AreaGraph/AreaGraph.component.tsx
import React, { useMemo, useState } from "react";
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
import { type ClientData } from "../../../types/ClientData.interface";
import { NoZeroTooltip } from "../../../components/tooltip";

interface AreaGraphProps {
  rawData: ClientData[];
  dateField: string;
  groupField: string;
  selectedYear: string;
  filterLabel?: string;
  height?: number;
}

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export const AreaGraph: React.FC<AreaGraphProps> = ({
  rawData,
  dateField,
  groupField,
  selectedYear,
  filterLabel,
  height = 360,
}) => {
  const chartColors = [
    "var(--chart-primary)",
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
  ];

  const colorFor = (idx: number) => chartColors[idx % chartColors.length];

  // categorias detectadas dinamicamente e ordenadas alfabeticamente
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rawData) {
      const raw = (r as any)[groupField];
      const key =
        raw === undefined || raw === null || String(raw).trim() === ""
          ? "Não informado"
          : String(raw).trim();
      map.set(key, (map.get(key) || 0) + 1);
    }
    // ordenar alfabeticamente
    return Array.from(map.keys()).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [rawData, groupField]);

  // estado interno da categoria selecionada - inicializa com a primeira categoria
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0] : ""
  );

  // Sincroniza selectedCategory quando as categorias mudam
  React.useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // calcula os últimos até 3 anos a partir do selectedYear
  const { areaGraphData, years } = useMemo(() => {
    const yearsSet = new Set<string>();
    for (const r of rawData) {
      const v = (r as any)[dateField];
      if (typeof v === "string") {
        const parts = v.split("-").map((p) => p.trim());
        const yPart = parts.find((p) => /^\d{4}$/.test(p));
        if (yPart) yearsSet.add(yPart);
        else {
          const last = parts[parts.length - 1];
          if (/^\d{4}$/.test(last)) yearsSet.add(last);
        }
      }
    }

    const allYearsNums = Array.from(yearsSet)
      .map(Number)
      .filter((n) => !Number.isNaN(n) && n <= Number(selectedYear))
      .sort((a, b) => b - a);

    const last3 = allYearsNums.slice(0, 3).map(String).sort();

    const months = Array.from({ length: 12 }, (_, i) => {
      const obj: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const y of last3) obj[y] = 0;
      return obj;
    });

    for (const r of rawData) {
      const dateValue = (r as any)[dateField];
      if (!dateValue || typeof dateValue !== "string") continue;

      const parts = dateValue.split("-").map((p: string) => p.trim());
      let yearStr: string | undefined;
      const four = parts.find((p: string) => /^\d{4}$/.test(p));
      yearStr = four ?? parts[parts.length - 1];

      if (!yearStr || !last3.includes(yearStr)) continue;

      let monthIdx: number | null = null;
      if (parts.length === 3) {
        const n = Number(parts[1]);
        if (!Number.isNaN(n) && n >= 1 && n <= 12) monthIdx = n - 1;
      }

      if (monthIdx === null) {
        for (const p of parts) {
          if (/^\d{1,2}$/.test(p)) {
            const n = Number(p);
            if (!Number.isNaN(n) && n >= 1 && n <= 12) {
              monthIdx = n - 1;
              break;
            }
          }
        }
      }

      if (monthIdx === null) continue;

      const rawGroup = (r as any)[groupField];
      const groupValue =
        rawGroup === undefined || rawGroup === null || String(rawGroup).trim() === ""
          ? "Não informado"
          : String(rawGroup).trim();

      // filtra apenas pela categoria selecionada (sem opção "Todos")
      if (groupValue !== selectedCategory) continue;

      months[monthIdx][yearStr] = (Number(months[monthIdx][yearStr]) || 0) + 1;
    }

    return { areaGraphData: months, years: last3 };
  }, [rawData, dateField, groupField, selectedYear, selectedCategory]);

  const displayTitle = filterLabel
    ? `Comparativo anual (${years.length} anos) — ${filterLabel}`
    : `Comparativo anual (${years.length} anos)`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
        <h3 className="text-lg font-semibold">{displayTitle}</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded"
            aria-label="Selecionar categoria para AreaGraph"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={areaGraphData}
            margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<NoZeroTooltip />} />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
            {years.map((yr, idx) => (
              <Area
                key={yr}
                type="monotone"
                dataKey={yr}
                name={yr}
                stroke={colorFor(idx)}
                fill={colorFor(idx)}
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
