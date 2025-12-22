import React, { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import type { PeriodType } from "../Filters/Filters.component";

interface AreaGraphProps {
  rawData: unknown[];
  dateField: string;
  groupField: string;
  selectedYear?: string;
  filterLabel?: string;
  filterOptions?: Record<string, string>;
  periodType?: PeriodType;
  periodValue?: string;
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
  [key: string]: any; // <-- adicione esta linha!
}

const chartConfig: ChartConfig = {
  label: "Desktop",
  color: "var(--chart-1)",
  theme: {
    light: "lightThemeColor",
    dark: "darkThemeColor",
  },
};

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const semesterLabels = ["1º Semestre", "2º Semestre"];
const quarterLabels = ["1º Trimestre", "2º Trimestre", "3º Trimestre", "4º Trimestre"];

export const AreaGraph: React.FC<AreaGraphProps> = ({
  rawData,
  dateField,
  groupField,
  selectedYear,
  filterLabel,
  periodType = "ano",
  periodValue = "0",
}) => {
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
    "var(--chart-9)",
    "var(--chart-10)",
    "var(--chart-11)",
    "var(--chart-12)",
    "var(--chart-13)",
    "var(--chart-14)",
    "var(--chart-15)",
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

  // Função para filtrar por período (apenas para o ano selecionado)
  const filterByPeriod = (dateValue: string) => {
    if (!dateValue || typeof dateValue !== "string") return false;
    const parts = dateValue.split("-").map((p) => p.trim());
    const yearStr = parts.find((p) => /^\d{4}$/.test(p)) ?? parts[parts.length - 1];
    if (yearStr !== selectedYear) return false;

    if (periodType === "ano") return true;

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
    if (monthIdx === null) return false;

    const pVal = Number(periodValue);

    if (periodType === "mes") return monthIdx === pVal;
    if (periodType === "trimestre") return Math.floor(monthIdx / 3) === pVal;
    if (periodType === "semestre") return Math.floor(monthIdx / 6) === pVal;

    return true;
  };

  // calcula os últimos até 3 anos a partir do selectedYear, filtrando pelo período apenas para o ano selecionado
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
      .sort((a, b) => a - b);

    // Pega até 3 anos, incluindo o selecionado e até 2 anteriores
    const last3 = allYearsNums.slice(-3);
    const last3Str = last3.map(String);

    const months = Array.from({ length: 12 }, (_, i) => {
      const obj: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const y of last3Str) obj[y] = 0;
      return obj;
    });

    for (const r of rawData) {
      const dateValue = (r as any)[dateField];
      if (!dateValue || typeof dateValue !== "string") continue;

      const parts = dateValue.split("-").map((p: string) => p.trim());
      let yearStr: string | undefined;
      const four = parts.find((p: string) => /^\d{4}$/.test(p));
      yearStr = four ?? parts[parts.length - 1];

      if (!yearStr || !last3Str.includes(yearStr)) continue;

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

      if (groupValue !== selectedCategory) continue;

      // Só filtra por período para o ano selecionado
      if (yearStr === selectedYear) {
        if (!filterByPeriod(dateValue)) continue;
      }

      months[monthIdx][yearStr] = (Number(months[monthIdx][yearStr]) || 0) + 1;
    }

    return { areaGraphData: months, years: last3Str };
  }, [rawData, dateField, selectedYear, filterByPeriod, groupField, selectedCategory]);

  // Descrição do período
  const periodDescription = useMemo(() => {
    switch (periodType) {
      case "semestre":
        return `Semestral — ${selectedYear} (${semesterLabels[Number(periodValue) || 0]})`;
      case "trimestre":
        return `Trimestral — ${selectedYear} (${quarterLabels[Number(periodValue) || 0]})`;
      case "mes":
        return `Mensal — ${selectedYear} (${MONTH_NAMES[Number(periodValue) || 0]})`;
      case "ano":
      default:
        return `Anual — ${selectedYear}`;
    }
  }, [periodType, periodValue, selectedYear]);

  const displayTitle = filterLabel
    ? `Comparativo anual (${years.length} anos) — ${filterLabel}`
    : `Comparativo anual (${years.length} anos)`;

  return (
    <div className="w-full h-fit">
      <Card>      
          <CardHeader>
            <CardTitle>{filterLabel}</CardTitle>
            <CardDescription>{displayTitle} — {periodDescription}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3 justify-end">
              <label className="text-sm font-medium">Categoria:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-2 rounded"
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