import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import type { PeriodType } from "../filters/Filters.component";

interface LineGraphProps {
  monthlyData: any;
  filtros: string[];
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


export const LineGraph: React.FC<LineGraphProps> = ({
  monthlyData,
  filtros,
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
    if (!Array.isArray(monthlyData) || monthlyData.length === 0) return [];
    return monthlyData.slice(startIdx, endIdx + 1);
  }, [monthlyData, startIdx, endIdx]);

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel}</CardTitle>
          <CardDescription>{periodDescription}</CardDescription>
        </CardHeader>

        <CardContent className="mt-6">

          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={visibleData}
              margin={{
                left: 0,
                right: 0,
              }}
              height={150}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => String(value).slice(0, 3)}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

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
