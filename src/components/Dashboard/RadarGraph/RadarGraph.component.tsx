import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"
import { extractYear, extractMonthIndex } from "../../../utils/dataHelpers";
import type { ClientData } from "../../../types/ClientData.interface";
import type { PeriodType } from "../Filters/Filters.component";

interface RadarGraphProps {
  rawData: ClientData[];
  dateField: string;
  groupField: string;
  selectedYear: string;
  maxCategories?: number;
  maxTribunals?: number;
  filterLabel?: string;
  filterOptions?: Record<string, string>;
  periodType?: PeriodType;
  periodValue?: string;
}

const DEFAULT_CATEGORY_LIMIT = 5;
const DEFAULT_TRIBUNAL_LIMIT = 8;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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

const chartConfig: ChartConfig = {
  label: "Desktop",
  color: "var(--chart-1)",
};

const MONTH_FULL_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const semesterLabels = ["1º Semestre", "2º Semestre"];
const quarterLabels = ["1º Trimestre", "2º Trimestre", "3º Trimestre", "4º Trimestre"];

// helper: frequência e ordenação por maior para extrair categorias/tribunais
const getFrequencyOrdered = <T extends Record<string, any>>(data: T[], field: string) => {
  const freq = new Map<string, number>();
  for (const r of data) {
    const raw = r?.[field];
    const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]);
};

export const RadarGraph: React.FC<RadarGraphProps> = ({
  rawData,
  dateField,
  groupField,
  selectedYear,
  maxCategories = DEFAULT_CATEGORY_LIMIT,
  maxTribunals = DEFAULT_TRIBUNAL_LIMIT,
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

  // Filtra por ano e período
  const filteredByPeriod = useMemo(() => {
    if (!rawData.length) return [] as ClientData[];
  
    if (periodType === "mes") {
      const pVal = Number(periodValue);
      // Filtra todos os anos, mas só o mês selecionado
      return rawData.filter(item => {
        const d = (item as any)[dateField];
        const mIdx = extractMonthIndex(d);
        return mIdx === pVal;
      });
    }
  
    // Filtro padrão: só o ano selecionado
    return rawData.filter(item => {
      const d = (item as any)[dateField];
      const y = extractYear(d);
      if (y !== selectedYear) return false;
  
      const mIdx = extractMonthIndex(d);
      if (mIdx === null) return false;
      
      if (periodType === "trimestre") {
        const pVal = Number(periodValue);
        return Math.floor(mIdx / 3) === pVal;
      }
      if (periodType === "semestre") {
        const pVal = Number(periodValue);
        return Math.floor(mIdx / 6) === pVal;
      }
      return true; // ano
    });
  }, [rawData, dateField, selectedYear, periodType, periodValue]);

  // categorias (groupField) ordenadas por frequência
  const topCategories = useMemo(() => {
    const ordered = getFrequencyOrdered(filteredByPeriod, groupField).map(([k]) => k);
    return ordered.slice(0, maxCategories);
  }, [filteredByPeriod, groupField, maxCategories]);

  // tribunais ordenados por frequência
  const topTribunals = useMemo(() => {
    const ordered = getFrequencyOrdered(filteredByPeriod, "tribunal").map(([k]) => k);
    return ordered.slice(0, maxTribunals);
  }, [filteredByPeriod, maxTribunals]);

  // constroi dados para RadarChart: cada item => { tribunal: 'TJRJ', Ganho: 3, Perdido: 1, ... }
  const radarData = useMemo(() => {
    const data: Record<string, any>[] = topTribunals.map(t => ({ tribunal: t }));
    for (const row of filteredByPeriod) {
      const tribun = String((row as any).tribunal ?? "Não informado").trim() || "Não informado";
      if (!topTribunals.includes(tribun)) continue;

      const rawCat = (row as any)[groupField];
      const cat = rawCat === undefined || rawCat === null || String(rawCat).trim() === "" ? "Não informado" : String(rawCat).trim();

      if (!topCategories.includes(cat)) continue;

      const idx = data.findIndex(d => d.tribunal === tribun);
      if (idx >= 0) {
        data[idx][cat] = (Number(data[idx][cat]) || 0) + 1;
      }
    }

    // garante que cada objeto tenha todas as chaves (0 quando ausente)
    for (const d of data) {
      for (const c of topCategories) {
        if (d[c] === undefined) d[c] = 0;
      }
    }

    return data;
  }, [filteredByPeriod, topTribunals, topCategories, groupField]);

  // Descrição do período
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
  }, [periodType, periodValue, selectedYear]);

  // se não houver dados, renderiza mensagem simples (pode ajustar a UI)
  if (!radarData.length || !topCategories.length) {
    return (
      <div className="p-4">
        <h6 className="font-semibold">{filterLabel ?? groupField}</h6>
        <div className="text-sm text-muted">Sem dados disponíveis para o período selecionado.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel}</CardTitle>
          <CardDescription>{periodDescription}</CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          <ChartContainer config={chartConfig}>
            <RadarChart cx="50%" cy="50%" outerRadius="81%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="tribunal" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              {topCategories.map((cat, idx) => (
                <Radar
                  key={cat}
                  name={cat}
                  dataKey={cat}
                  stroke={colorFor(idx)}
                  fill={colorFor(idx)}
                  fillOpacity={0.25}
                />
              ))}
            </RadarChart>
          </ChartContainer>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Procesos por {filterLabel} ao longo de {periodDescription} <TrendingUp className="h-4 w-4" />
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