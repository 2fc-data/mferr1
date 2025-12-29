import { useMemo } from "react";
import { DATA_CLIENT } from "../data/DATA_CLIENTS";
import { extractYear, extractMonthIndex } from "../utils/dataHelpers";
import type { PeriodType } from "../components/dashboard/filters/Filters.component";
import type { ClientData } from "../types/ClientData.interface";

interface UseSummaryDataProps {
  selectedYear: string;
  selectedOption: string;
  filterOptions?: Record<string, string>;
  filterLabel?: string;
  periodType?: PeriodType;
  periodValue?: string;
}

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const getFrequencyCategories = <T extends Record<string, any>>(data: T[], field: string): string[] => {
  const freq = new Map<string, number>();
  for (const r of data) {
    const raw = r?.[field];
    const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
};

export const useSummaryData = ({
  selectedYear,
  selectedOption,
  filterOptions,
  filterLabel,
  periodType = "ano",
  periodValue = "0",
}: UseSummaryDataProps) => {
  const campo = selectedOption || "desfecho";

  const dateField = useMemo(() => (campo === "desfecho" ? "data_desfecho" : "data_entrada"), [campo]);

  const filteredData: ClientData[] = useMemo(() => {
    if (!selectedYear || selectedYear === "--") return [];

    return DATA_CLIENT.filter((item) => {
      const dateValue = (item as any)[dateField];
      const y = extractYear(dateValue);
      if (y !== selectedYear) return false;

      if (periodType === "ano") return true;

      const mIdx = extractMonthIndex(dateValue);
      if (mIdx === null) return false;

      const pVal = Number(periodValue);

      if (periodType === "mes") {
        return mIdx === pVal;
      }

      if (periodType === "trimestre") {
        const quarter = Math.floor(mIdx / 3);
        return quarter === pVal;
      }

      if (periodType === "semestre") {
        const semester = Math.floor(mIdx / 6);
        return semester === pVal;
      }

      return true;
    });
  }, [selectedYear, dateField, periodType, periodValue]);

  const uniqueClientsCount = useMemo(() => {
    const set = new Set<string>();
    for (const c of filteredData) if (c.cliente_cpf) set.add(String(c.cliente_cpf));
    return set.size;
  }, [filteredData]);

  const actionCount = useMemo(() => {
    const set = new Set<string>();
    for (const c of filteredData) if (c.numero_processo) set.add(String(c.numero_processo));
    return set.size;
  }, [filteredData]);

  const legalFeesCount = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const raw = (item as any).valor_processo ?? (item as any).valor_causa ?? "0";
      const v = parseFloat(raw ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [filteredData]);

  const honoraryCount = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const v = parseFloat((item as any).valor_honorario ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [filteredData]);

  const clientFeesCount = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const v = parseFloat((item as any).valor_cliente ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [filteredData]);

  const onTable = legalFeesCount - honoraryCount + clientFeesCount;

  const filtros = useMemo(() => getFrequencyCategories(filteredData, campo), [filteredData, campo]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const base: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const f of filtros) base[f] = 0;
      return base;
    });

    for (const row of filteredData) {
      const dateValue = (row as any)[dateField];
      const mIdx = extractMonthIndex(dateValue);
      if (mIdx === null) continue;

      const raw = (row as any)[campo];
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      if (!filtros.includes(key) || key === "Não informado") continue;

      months[mIdx][key] = (Number(months[mIdx][key]) || 0) + 1;
    }

    return months;
  }, [filteredData, filtros, campo, dateField]);

  const lineGraphData = useMemo(() => {
    const p = Number(periodValue);
    let startIdx = 0;
    let endIdx = 11;

    if (periodType === "semestre") {
      if (p === 1) { startIdx = 6; endIdx = 11; }
      else { startIdx = 0; endIdx = 5; }
    } else if (periodType === "trimestre") {
      startIdx = p * 3;
      endIdx = startIdx + 2;
    } else if (periodType === "mes") {
      startIdx = p;
      endIdx = p;
    }

    return monthlyData.slice(startIdx, endIdx + 1);
  }, [monthlyData, periodType, periodValue]);

  const { peakMonth, peakValue } = useMemo(() => {
    let max = -1;
    let month = "";

    for (const item of lineGraphData) {
      let sum = 0;
      Object.keys(item).forEach((key) => {
        if (key !== "month") {
          sum += Number(item[key] || 0);
        }
      });

      if (sum > max) {
        max = sum;
        month = String(item.month);
      }
    }
    return { peakMonth: month, peakValue: max };
  }, [lineGraphData]);

  const barGraphData = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of filteredData) {
      const raw = (row as any)[campo];
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [filteredData, campo]);

  const cityData = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of filteredData) {
      const raw = (row as any).cliente_cidade;
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    // Sort by value descending
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [filteredData]);

  const friendlyLabel = useMemo(() => {
    return filterLabel ?? (filterOptions ? filterOptions[campo] : undefined) ?? campo;
  }, [filterLabel, filterOptions, campo]);

  return {
    dateField,
    campo,
    filteredData,
    uniqueClientsCount,
    actionCount,
    legalFeesCount,
    honoraryCount,
    clientFeesCount,
    onTable,
    filtros,
    monthlyData,
    lineGraphData,
    barGraphData,
    cityData,
    peakMonth,
    peakValue,
    friendlyLabel,
  };
};
