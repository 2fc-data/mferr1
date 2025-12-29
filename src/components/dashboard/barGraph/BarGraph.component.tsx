import React from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList
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
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
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
      case "ano":
        return `Ano — ${selectedYear}`;
      default:
        return `Ano — ${selectedYear}`;
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
              layout="vertical"
              margin={{ top: 20, right: 20, left: 8, bottom: 5 }}
              barCategoryGap="15%"
              barGap={10}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
              // dataKey="name"
              // tick={{ fontSize: 12 }}
              // interval={0}
              // angle={-20}
              // textAnchor="end"
              // height={60}
              />
              <YAxis
                // allowDecimals={false}
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={120}
              />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar
                dataKey="value"
                barSize={30}
                radius={[6, 6, 0, 0]}
              >
                {visibleData.map((_: any, idx: number) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={chartColors[idx % chartColors.length]}
                  />
                ))}

                <LabelList
                  dataKey="value"
                  position="right"
                  fontSize={14}
                  fill="black"
                />
              </Bar>
            </BarChart>
          </ChartContainer>

          <CardFooter>
            <div className="flex w-full items-start mt-3 gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Causas por {filterLabel} ao longo de {periodDescription} <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};