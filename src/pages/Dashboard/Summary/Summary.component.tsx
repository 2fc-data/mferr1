// src/components/Summary/Summary.component.tsx
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

import { extractYearFromDesfecho } from "../../../utils/dataHelpers";

interface SummaryProps {
  selectedYear: string;
  selectedOption: string; // ex: "desfecho" | "status_processo" | "cliente_cidade" | "estagio_atual"
}

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

/**
 * extrai índice do mês (0..11) a partir de data no formato dd-mm-yyyy ou yyyy-mm-dd
 * retorna null caso inválido / vazio
 */
const extractMonthIndex = (dateStr?: string): number | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(p => p.trim());
  if (parts.length !== 3) return null;

  // se for yyyy-mm-dd
  if (parts[0].length === 4) {
    const m = Number(parts[1]);
    if (Number.isFinite(m) && m >= 1 && m <= 12) return m - 1;
    return null;
  }

  // assume dd-mm-yyyy
  if (parts[2].length === 4) {
    const m = Number(parts[1]);
    if (Number.isFinite(m) && m >= 1 && m <= 12) return m - 1;
    return null;
  }

  // fallback: procurar parte com 1-2 dígitos plausível
  for (const p of parts) {
    if (/^\d{1,2}$/.test(p)) {
      const n = Number(p);
      if (n >= 1 && n <= 12) return n - 1;
    }
  }

  return null;
};

/**
 * calcula categorias ordenadas por frequência (desc) para um campo dinâmico
 * - retorna array de chaves (string). Usa "Não informado" quando undefined/null/empty.
 */
const getFrequencyCategories = <T extends Record<string, any>>(data: T[], field: string): string[] => {
  const freq = new Map<string, number>();
  for (const r of data) {
    const raw = r?.[field];
    const key = (raw === undefined || raw === null) ? "Não informado" : String(raw).trim() || "Não informado";
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1]) // por frequência desc
    .map(([k]) => k);
};

export const Summary: React.FC<SummaryProps> = ({ selectedYear, selectedOption }) => {
  // ---------------------------
  // Dados filtrados pelo ano
  // ---------------------------
  const summaryYear: ClientData[] = useMemo(() => {
    if (!selectedYear || selectedYear === "--") return [];
    return DATA_CLIENT.filter(item => extractYearFromDesfecho(item.data_desfecho) === selectedYear);
  }, [selectedYear]);

  // ---------------------------
  // Indicadores numéricos
  // ---------------------------
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

  // ---------------------------
  // CATEGORIAS (filtros) dinâmicos
  // ---------------------------
  // selectedOption é o nome do campo no objeto ClientData
  const campo = selectedOption || "desfecho";

  const filtros = useMemo(() => {
    return getFrequencyCategories(summaryYear, campo);
  }, [summaryYear, campo]);

  // ---------------------------
  // LineGraph: monthlyData (12 meses) com séries para cada categoria (filtros)
  // formato: [{ month: 'Jan', 'Ganho': 2, 'Perdido': 0, ... }, ...]
  // ---------------------------
  const monthlyData = useMemo(() => {
    // inicializa 12 meses com todas as keys de filtros = 0
    const months = Array.from({ length: 12 }, (_, i) => {
      const base: Record<string, number | string> = { month: MONTH_NAMES[i] };
      for (const f of filtros) base[f] = 0;
      return base;
    });

    if (filtros.length === 0) return months;

    for (const row of summaryYear) {
      const mIdx = extractMonthIndex(row.data_desfecho);
      if (mIdx === null) continue;
      const raw = row  && (row as any)[campo];
      const key = (raw === undefined || raw === null) ? "Não informado" : String(raw).trim() || "Não informado";
      if (!filtros.includes(key)) continue;
      // @ts-expect-error operação dinâmica em objeto
      months[mIdx][key] = (months[mIdx][key] || 0) + 1;
    }

    return months;
  }, [summaryYear, filtros, campo]);

  // ---------------------------
  // BarGraph: total por categoria no ano
  // formato: [{ name: 'Ganho', value: 12 }, ...]
  // ---------------------------
  const barGraphData = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of summaryYear) {
      const raw = row  && (row as any)[campo];
      const key = (raw === undefined || raw === null) ? "Não informado" : String(raw).trim() || "Não informado";
      map.set(key, (map.get(key) || 0) + 1);
    }

    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    arr.sort((a, b) => b.value - a.value); // ordenar por total desc
    return arr;
  }, [summaryYear, campo]);

  // ---------------------------
  // MARKUP
  // ---------------------------
  return (
    <div className="p-4">
      <div className="gap-3 grid md:grid-cols-[repeat(auto-fill,minmax(90%,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(45%,1fr))] mb-21">
        <div className="card">
          <LineGraph monthlyData={monthlyData} filtros={filtros} selectedYear={selectedYear} />
        </div>

        <div className="card">
          <BarGraph data={barGraphData} selectedYear={selectedYear} />
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
