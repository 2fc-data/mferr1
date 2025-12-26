import React, { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { extractYear, extractMonthIndex } from "../../../utils/dataHelpers";
import type { ClientData } from "../../../types/ClientData.interface";
import type { PeriodType } from "../filters/Filters.component";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface AreaGraphProps {
  rawData: ClientData[];
  dateField: string;
  groupField: string;
  selectedYear: string;
  filterLabel?: string;
  periodType?: PeriodType;
  periodValue?: string;
}

/* -------------------------------------------------------------------------- */
/* Constantes                                                                 */
/* -------------------------------------------------------------------------- */

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const semesterLabels = ["1º Semestre", "2º Semestre"];
const quarterLabels = ["1º Trimestre", "2º Trimestre", "3º Trimestre", "4º Trimestre"];

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
];

const colorFor = (idx: number) => chartColors[idx % chartColors.length];

/* -------------------------------------------------------------------------- */
/* Componente                                                                 */
/* -------------------------------------------------------------------------- */

export const AreaGraph: React.FC<AreaGraphProps> = ({
  rawData,
  dateField,
  groupField,
  selectedYear,
  filterLabel,
  periodType = "ano",
  periodValue = "0",
}) => {

  /* ------------------------------------------------------------------------ */
  /* Anos comparados                                                          */
  /* ------------------------------------------------------------------------ */

  const years = useMemo(() => {
    const y = Number(selectedYear);
    if (Number.isNaN(y)) return [];
    return [y - 2, y - 1, y].map(String);
  }, [selectedYear]);

  /* ------------------------------------------------------------------------ */
  /* Categorias                                                               */
  /* ------------------------------------------------------------------------ */

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const row of rawData) {
      const raw = (row as any)[groupField];
      const key =
        raw === undefined || raw === null || String(raw).trim() === ""
          ? "Não informado"
          : String(raw).trim();
      set.add(key);
    }
    return Array.from(set).sort();
  }, [rawData, groupField]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0] ?? "Não informado"
  );

  /* ------------------------------------------------------------------------ */
  /* Filtro por período                                                       */
  /* ------------------------------------------------------------------------ */

  const isDateInSelectedPeriod = (
    dateValue: any,
    year: string
  ): boolean => {
    const y = extractYear(dateValue);
    if (y !== year) return false;

    if (periodType === "ano") return true;

    const mIdx = extractMonthIndex(dateValue);
    if (mIdx === null) return false;

    const pVal = Number(periodValue);

    if (periodType === "mes") {
      return mIdx === pVal;
    }

    if (periodType === "trimestre") {
      return Math.floor(mIdx / 3) === pVal;
    }

    if (periodType === "semestre") {
      return Math.floor(mIdx / 6) === pVal;
    }

    return true;
  };

  /* ------------------------------------------------------------------------ */
  /* Dados do gráfico                                                         */
  /* ------------------------------------------------------------------------ */

  const areaGraphData = useMemo(() => {
    const baseMonths =
      periodType === "mes"
        ? [Number(periodValue)]
        : periodType === "trimestre"
          ? Array.from({ length: 3 }, (_, i) => Number(periodValue) * 3 + i)
          : periodType === "semestre"
            ? Array.from({ length: 6 }, (_, i) => Number(periodValue) * 6 + i)
            : Array.from({ length: 12 }, (_, i) => i);

    return baseMonths.map((mIdx) => {
      const row: Record<string, any> = {
        month: MONTH_NAMES[mIdx],
      };

      for (const y of years) {
        row[y] = rawData.filter((item) => {
          const dateValue = (item as any)[dateField];
          if (!isDateInSelectedPeriod(dateValue, y)) return false;

          const itemMonth = extractMonthIndex(dateValue);
          if (itemMonth !== mIdx) return false;

          const raw = (item as any)[groupField];
          const key =
            raw === undefined || raw === null || String(raw).trim() === ""
              ? "Não informado"
              : String(raw).trim();

          return key === selectedCategory;
        }).length;
      }

      return row;
    });
  }, [
    rawData,
    years,
    dateField,
    groupField,
    selectedCategory,
    periodType,
    periodValue,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Labels                                                                   */
  /* ------------------------------------------------------------------------ */

  const periodDescription = useMemo(() => {
    switch (periodType) {
      case "semestre":
        return semesterLabels[Number(periodValue)] ?? "";
      case "trimestre":
        return quarterLabels[Number(periodValue)] ?? "";
      case "mes":
        return MONTH_NAMES[Number(periodValue)] ?? "";
      default:
        return "Ano completo";
    }
  }, [periodType, periodValue]);

  const displayTitle = "Comparativo anual";

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  if (!areaGraphData.length || !years.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Sem dados disponíveis para o período selecionado.
      </div>
    );
  }

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader className="grid grid-cols-2">
          <div>
            <CardTitle>{filterLabel}</CardTitle>
            <CardDescription>
              {displayTitle} — {periodDescription}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 justify-end mb-4">
            <label className="text-sm font-medium">Categoria:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border px-2 rounded bg-background"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent>


          <ChartContainer config={{}}>
            <AreaChart data={areaGraphData} margin={{ left: 0, right: 20 }}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis allowDecimals={false} />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />

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
        </CardContent>

        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Causas por {filterLabel} ao longo de {periodDescription}
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
