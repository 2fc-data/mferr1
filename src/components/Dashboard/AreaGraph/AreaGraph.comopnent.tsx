// src/components/AreaGraph/AreaGraph.component.tsx
import React, { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { type ClientData } from "../../../types/ClientData.interface";

interface AreaGraphProps {
  rawData: ClientData[];
  dateField: string;
  groupField: string;
  selectedYear: string;
  filterLabel?: string;
  height?: number;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartConfig {
  label?: string;
  icon?: React.ComponentType;
  color?: string;
  theme?: {
    light?: string;
    dark?: string;
  };
  [key: string]: any;
}

// Criando a configuração com um objeto básico
const chartConfig: ChartConfig = {
  label: "Desktop",
  color: "var(--chart-1)",
};


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
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel}</CardTitle>
          <CardDescription>{displayTitle} — {selectedYear}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 justify-end">
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
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={areaGraphData}
              margin={{ left: 0, right: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

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
          </ChartContainer>

          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Procesos por {filterLabel} ao longo de {selectedYear} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Passe o mouse para ver detalhes.
                </div>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
