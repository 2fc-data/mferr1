// src/pages/Dashboard/Summary.component.tsx
import React, { useMemo } from "react";

import { formatBRL } from "../../../utils/Formatters";
import { UniqueClientsCount } from "../TotalClients/TotalClients.component";
import { ActionsCount } from "../TotalActions/TotalActions.component";
import { DATA_CLIENT } from "../../../data/DATA_CLIENTS";
import { type ClientData } from "../../../types/ClientData.interface";
import { LegalFeesCount } from "../TotalLegalFees";
import { HonoraryCount } from "../TotalHonorary/TotalHonorary.component";
import { FeesClientsCount } from "../TotalFeesClients";
import { BarGraph } from "../BarGraph";
import { LineGraph } from "../LineGraph";
import { AreaGraph } from "../AreaGraph";
import { RadarGraph } from "../RadarGraph";

import { extractYear, extractMonthIndex } from "../../../utils/dataHelpers";

interface SummaryProps {
  selectedYear: string;
  selectedOption: string;
  filterOptions?: Record<string, string>;
  filterLabel?: string;
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

export const Summary: React.FC<SummaryProps> = ({ selectedYear, selectedOption, filterOptions, filterLabel }) => {
  const campo = selectedOption || "desfecho";

  // define dateField: desfecho -> data_desfecho; outros -> data_entrada
  const dateField = useMemo(() => (campo === "desfecho" ? "data_desfecho" : "data_entrada"), [campo]);

  // Filtra dados pelo ano selecionado (usando dateField)
  const summaryYear: ClientData[] = useMemo(() => {
    if (!selectedYear || selectedYear === "--") return [];
    return DATA_CLIENT.filter(item => {
      const dateValue = (item as any)[dateField];
      const y = extractYear(dateValue);
      return y === selectedYear;
    });
  }, [selectedYear, dateField]);

  // Indicadores
  const uniqueClientsCount = useMemo(() => {
    const set = new Set<string>();
    for (const c of summaryYear) if (c.cliente_cpf) set.add(String(c.cliente_cpf));
    return set.size;
  }, [summaryYear]);

  const actionCount = useMemo(() => {
    const set = new Set<string>();
    for (const c of summaryYear) if (c.numero_processo) set.add(String(c.numero_processo));
    return set.size;
  }, [summaryYear]);

  const legalFeesCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const raw = (item as any).valor_processo ?? (item as any).valor_causa ?? "0";
      const v = parseFloat(raw ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [summaryYear]);

  const honoraryCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const v = parseFloat((item as any).valor_honorario ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [summaryYear]);

  const clientFeesCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const v = parseFloat((item as any).valor_cliente ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [summaryYear]);

  const letOnTable = (honoraryCount + clientFeesCount) - legalFeesCount;

  // categorias (filtros) dinâmicos
  const filtros = useMemo(() => getFrequencyCategories(summaryYear, campo), [summaryYear, campo]);

  // LineGraph mensal (usa dateField)
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const base: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const f of filtros) base[f] = 0;
      return base;
    });

    for (const row of summaryYear) {
      const dateValue = (row as any)[dateField];
      const mIdx = extractMonthIndex(dateValue);
      if (mIdx === null) continue;

      const raw = (row as any)[campo];
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      if (!filtros.includes(key) || key === "Não informado") continue;

      months[mIdx][key] = (Number(months[mIdx][key]) || 0) + 1;
    }

    return months;
  }, [summaryYear, filtros, campo, dateField]);

  // BarGraph total anual
  const barGraphData = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of summaryYear) {
      const raw = (row as any)[campo];
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [summaryYear, campo]);

  // friendly label para título do AreaGraph
  const friendlyLabel = useMemo(() => {
    return filterLabel ?? (filterOptions ? filterOptions[campo] : undefined) ?? campo;
  }, [filterLabel, filterOptions, campo]);

  return (
    <div className="p-4">
      <div className="gap-3 grid md:grid-cols-[repeat(auto-fill,minmax(90%,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(45%,1fr))] mb-21">
        <div className="card">
          <LineGraph monthlyData={monthlyData} filtros={filtros} selectedYear={selectedYear} filterLabel={friendlyLabel} />
        </div>

        <div className="card">
          <BarGraph data={barGraphData} selectedYear={selectedYear} filterLabel={friendlyLabel} />
        </div>

        <div className="card">
          <AreaGraph
            rawData={DATA_CLIENT}
            dateField={dateField}
            groupField={campo}
            selectedYear={selectedYear}
            filterLabel={friendlyLabel}
          />
        </div>

        <div className="card">
          <RadarGraph
            rawData={DATA_CLIENT}
            dateField={dateField}
            groupField={campo}
            selectedYear={selectedYear}
            filterLabel={friendlyLabel}
            maxCategories={5}
            maxTribunals={8}
          />
        </div>
      </div>

      <div className="gap-3 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
        <div className="card">
          <UniqueClientsCount count={uniqueClientsCount} />
        </div>

        <div className="card">
          <ActionsCount count={actionCount} />
        </div>

        <div className="card">
          <LegalFeesCount count={legalFeesCount} />
        </div>

        <div className="card">
          <HonoraryCount count={honoraryCount} />
        </div>

        <div className="card">
          <FeesClientsCount count={clientFeesCount} />
        </div>

        <div className="card">
          <h6 className="font-bold">Ficou na Mesa</h6>
          <h4 className="font-bold">{formatBRL(letOnTable)}</h4>
        </div>
      </div>
    </div>
  );
};
