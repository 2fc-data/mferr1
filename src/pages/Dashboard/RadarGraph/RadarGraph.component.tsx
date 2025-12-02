// src/pages/Dashboard/RadarGraph.tsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { extractYear } from "../../../utils/dataHelpers";
import type { ClientData } from "../../../types/ClientData.interface";

interface RadarGraphProps {
  rawData: ClientData[];              // ex: DATA_CLIENT
  dateField: string;                  // ex: "data_desfecho" ou "data_entrada"
  groupField: string;                 // ex: "desfecho" ou "status_processo"
  selectedYear: string;               // ex: "2025"
  maxCategories?: number;             // quantas categorias do groupField mostrar (padrão 5)
  maxTribunals?: number;              // quantos tribunais mostrar (padrão 8)
  filterLabel?: string;               // label amigável
}

const DEFAULT_CATEGORY_LIMIT = 5;
const DEFAULT_TRIBUNAL_LIMIT = 8;

// helper: frequência e ordenação por maior para extrair categorias/tribunais
const getFrequencyOrdered = <T extends Record<string, any>>(data: T[], field: string) => {
  const freq = new Map<string, number>();
  for (const r of data) {
    const raw = r?.[field];
    const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]); // [ [key, count], ... ]
};

export const RadarGraph: React.FC<RadarGraphProps> = ({
  rawData,
  dateField,
  groupField,
  selectedYear,
  maxCategories = DEFAULT_CATEGORY_LIMIT,
  maxTribunals = DEFAULT_TRIBUNAL_LIMIT,
  filterLabel,
}) => {

  const chartColors = [
    "var(--chart-primary)",
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
  ];

  const colorFor = (idx: number) => chartColors[idx % chartColors.length];

  // filtra por ano (se selectedYear for válido)
  const filteredByYear = useMemo(() => {
    if (!selectedYear || selectedYear === "--") return [] as ClientData[];
    return rawData.filter(item => {
      const d = (item as any)[dateField];
      const y = extractYear(d);
      return y === selectedYear;
    });
  }, [rawData, dateField, selectedYear]);

  // categorias (groupField) ordenadas por frequência
  const topCategories = useMemo(() => {
    const ordered = getFrequencyOrdered(filteredByYear, groupField).map(([k]) => k);
    return ordered.slice(0, maxCategories);
  }, [filteredByYear, groupField, maxCategories]);

  // tribunais ordenados por frequência
  const topTribunals = useMemo(() => {
    const ordered = getFrequencyOrdered(filteredByYear, "tribunal").map(([k]) => k);
    return ordered.slice(0, maxTribunals);
  }, [filteredByYear, maxTribunals]);

  // constroi dados para RadarChart: cada item => { tribunal: 'TJRJ', Ganho: 3, Perdido: 1, ... }
  const radarData = useMemo(() => {
    const data: Record<string, any>[] = topTribunals.map(t => ({ tribunal: t }));
    for (const row of filteredByYear) {
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
  }, [filteredByYear, topTribunals, topCategories, groupField]);

  // se não houver dados, renderiza mensagem simples (pode ajustar a UI)
  if (!radarData.length || !topCategories.length) {
    return (
      <div className="p-4">
        <h6 className="font-semibold">{filterLabel ?? groupField}</h6>
        <div className="text-sm text-muted">Sem dados disponíveis para o ano selecionado.</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 360 }}>
      <h6 className="font-semibold mb-2">{filterLabel ?? groupField} — Tribunais</h6>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="81%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="tribunal" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
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
          <Tooltip />
          <Legend verticalAlign="bottom" height={0} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
