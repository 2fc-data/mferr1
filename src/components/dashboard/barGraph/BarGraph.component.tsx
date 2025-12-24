import React from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

import type { PeriodType } from "../filters/Filters.component";

interface BarGraphProps {
  data: any;
  selectedYear?: string;
  filterLabel?: string;
  filterOptions?: Record<string, string>;
  periodType?: PeriodType;
  periodValue?: string;
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

// Definindo a interface ChartConfig conforme esperado
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

export const BarGraph: React.FC<BarGraphProps> = ({
  data,
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

  const MONTH_FULL_NAMES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const semesterLabels = ["1º Semestre", "2º Semestre"];
  const quarterLabels = ["1º Trimestre", "2º Trimestre", "3º Trimestre", "4º Trimestre"];

  const getPeriodRange = () => {
    const p = Number(periodValue);
    switch (periodType) {
      case "semestre":
        return p === 1 ? [6, 11] : [0, 5];
      case "trimestre": {
        const start = p * 3;
        return [start, start + 2];
      }
      case "mes":
        return [p, p];
      default:
        return [0, 11];
    }
  };

  const [startIdx, endIdx] = getPeriodRange();

  const visibleData = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.slice(startIdx, endIdx + 1);
  }, [data, startIdx, endIdx]);

  const periodDescription = React.useMemo(() => {
    switch (periodType) {
      case "semestre":
        return `Semestral — ${selectedYear} (${semesterLabels[Number(periodValue) || 0]})`;
      case "trimestre":
        return `Trimestral — ${selectedYear} (${quarterLabels[Number(periodValue) || 0]})`;
      case "mes":
        return `Mensal — ${selectedYear} (${MONTH_FULL_NAMES[Number(periodValue) || 0]})`;
      default:
        return `Mensal — ${selectedYear}`;
    }
  }, [MONTH_FULL_NAMES, periodType, periodValue, quarterLabels, selectedYear, semesterLabels]);

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel}</CardTitle>
          <CardDescription>{periodDescription}</CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={visibleData}
              margin={{ top: 20, right: 20, left: 8, bottom: 5 }}
              barCategoryGap="15%"
              barGap={10}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar
                dataKey="value"
                barSize={45}
                radius={[6, 6, 0, 0]}
              >
                {visibleData.map((_: any, idx: number) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={chartColors[idx % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>

          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Procesos por {filterLabel} ao longo de {periodType === 'ano' ? selectedYear : `${selectedYear} — ${periodType === 'mes' ? MONTH_FULL_NAMES[Number(periodValue) || 0] : (periodType === 'semestre' ? semesterLabels[Number(periodValue) || 0] : quarterLabels[Number(periodValue) || 0])}`} <TrendingUp className="h-4 w-4" />
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