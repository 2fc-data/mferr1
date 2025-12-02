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

  // AreaGraph: últimos 3 anos a partir do selectedYear
  const areaDataAndYears = useMemo(() => {
    // últimos 3 anos até o selectedYear
    const allYears = Array.from(
      new Set(
        DATA_CLIENT.map(r => extractYearFromDesfecho(r.data_desfecho)).filter(Boolean) as string[]
      )
    )
      .map(Number)
      .filter(y => y <= Number(selectedYear))
      .sort((a, b) => b - a);

    const last3Years = allYears.slice(0, 3).map(String).sort(); // ascendente

    const months = Array.from({ length: 12 }, (_, i) => {
      const obj: Record<string, string | number> = { month: MONTH_NAMES[i] };
      for (const y of last3Years) obj[y] = 0;
      return obj;
    });

    for (const row of DATA_CLIENT) {
      const y = extractYearFromDesfecho(row.data_desfecho);
      if (!y || !last3Years.includes(y)) continue;

      const mIdx = extractMonthIndex(row.data_desfecho);
      if (mIdx === null) continue;

      // selectedOption define o "filtro" dentro do mês
      const key = row[selectedOption] ?? "Não informado";
      // contamos apenas os itens, ignorando chave em si
      months[mIdx][y] = (Number(months[mIdx][y]) || 0) + 1;
    }

    return { areaGraphData: months, last3Years };
  }, [selectedYear, selectedOption]);

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
          <AreaGraph data={areaDataAndYears.areaGraphData} years={areaDataAndYears.last3Years} />
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
