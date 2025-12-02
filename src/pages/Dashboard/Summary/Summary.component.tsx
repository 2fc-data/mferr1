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

import { extractYearFromDesfecho, extractMonthIndex } from "../../../utils/dataHelpers";

interface SummaryProps {
  selectedYear: string;
  selectedOption: string; // ex: "desfecho" | "status_processo" | "cliente_cidade" | "estagio_atual"
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

export const Summary: React.FC<SummaryProps> = ({ selectedYear, selectedOption }) => {
  const campo = selectedOption || "desfecho";

  // Filtra dados pelo ano selecionado
  const summaryYear: ClientData[] = useMemo(() => {
    if (!selectedYear || selectedYear === "--") return [];
    return DATA_CLIENT.filter(item => extractYearFromDesfecho(item.data_desfecho) === selectedYear);
  }, [selectedYear]);

  // Indicadores numéricos
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
      const v = parseFloat(item.valor_causa ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [summaryYear]);

  const honoraryCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const v = parseFloat(item.valor_honorario ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [summaryYear]);

  const clientFeesCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const v = parseFloat(item.valor_cliente ?? "0");
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [summaryYear]);

  const letOnTable = (honoraryCount + clientFeesCount) - legalFeesCount;

  // Filtros dinâmicos
  const filtros = useMemo(() => getFrequencyCategories(summaryYear, campo), [summaryYear, campo]);

  // LineGraph mensal
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const base: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const f of filtros) base[f] = 0;
      return base;
    });

    for (const row of summaryYear) {
      const mIdx = extractMonthIndex(row.data_desfecho);
      if (mIdx === null) continue;

      const raw = row[campo];
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      if (!filtros.includes(key) || key === "Não informado") continue;

      months[mIdx][key] = (Number(months[mIdx][key]) || 0) + 1;
    }

    return months;
  }, [summaryYear, filtros, campo]);

  // BarGraph total anual
  const barGraphData = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of summaryYear) {
      const raw = row[campo];
      const key = raw === undefined || raw === null || String(raw).trim() === "" ? "Não informado" : String(raw).trim();
      map.set(key, (map.get(key) || 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr;
  }, [summaryYear, campo]);

  // AreaGraph: últimos 3 anos
  const areaData = useMemo(() => {
    const allYearsSet = new Set<string>();
    for (const r of DATA_CLIENT) {
      const y = extractYearFromDesfecho(r.data_desfecho);
      if (y) allYearsSet.add(y);
    }
    const last3Years = Array.from(allYearsSet).sort((a, b) => Number(b) - Number(a)).slice(0, 3);

    const months = Array.from({ length: 12 }, (_, i) => {
      const base: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const y of last3Years) base[y] = 0;
      return base;
    });

    for (const row of DATA_CLIENT) {
      const year = extractYearFromDesfecho(row.data_desfecho);
      if (!year || !last3Years.includes(year)) continue;

      const monthIdx = extractMonthIndex(row.data_desfecho);
      if (monthIdx === null) continue;

      const raw = row[campo];
      if (raw === undefined || raw === null || String(raw).trim() === "") continue;

      months[monthIdx][year] = (Number(months[monthIdx][year]) || 0) + 1;
    }

    return months;
  }, [campo]);

  // últimos 3 anos calculados para passar ao AreaGraph
  const last3Years = useMemo(() => {
    const allYearsSet = new Set<string>();
    for (const r of DATA_CLIENT) {
      const y = extractYearFromDesfecho(r.data_desfecho);
      if (y) allYearsSet.add(y);
    }
    return Array.from(allYearsSet).sort((a, b) => Number(b) - Number(a)).slice(0, 3);
  }, []);

  return (
    <div className="p-4">
      <div className="gap-3 grid md:grid-cols-[repeat(auto-fill,minmax(90%,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(45%,1fr))] mb-21">
        <div className="card">
          <LineGraph monthlyData={monthlyData} filtros={filtros} selectedYear={selectedYear} />
        </div>

        <div className="card">
          <BarGraph data={barGraphData} selectedYear={selectedYear} />
        </div>

        <div className="card">
          <AreaGraph data={areaData} years={last3Years} />
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
