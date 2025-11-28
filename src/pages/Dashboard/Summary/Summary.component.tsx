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

interface SummaryProps {
  selectedYear: string
}

const extractYear = (dateStr?: string): string | null => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("-");
  const yearPart = parts.find((p) => /^\d{4}$/.test(p));
  if (yearPart) return yearPart;
  const last = parts[parts.length - 1];
  return /^\d{4}$/.test(last) ? last : null;
};

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const extractMonthIndex = (dateStr?: string): number | null => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    if (parts[0].length === 4) { // yyyy-mm-dd
      const m = Number(parts[1]);
      if (Number.isFinite(m) && m >= 1 && m <= 12) return m - 1;
    } else { // dd-mm-yyyy
      const m = Number(parts[1]);
      if (Number.isFinite(m) && m >= 1 && m <= 12) return m - 1;
    }
  }
  for (const p of parts) {
    if (/^\d{2}$/.test(p)) {
      const m = Number(p);
      if (m >= 1 && m <= 12) return m - 1;
    }
  }
  return null;
};


export const Summary: React.FC<SummaryProps> = ({ selectedYear }) => {
  const summaryYear: ClientData[] = useMemo(
    () => DATA_CLIENT.filter(item => extractYear(item.data_desfecho) === selectedYear),
    [selectedYear]
  );

  const uniqueClientsCount = useMemo(() => {
    const set = new Set<string>();
    summaryYear.forEach(c => { if (c.cliente_cpf) set.add(String(c.cliente_cpf)); });
    return set.size;
  }, [summaryYear]);

  const actionCount = useMemo(() => {
    const set = new Set<string>();
    summaryYear.forEach(c => { if (c.numero_processo) set.add(String(c.numero_processo)); });
    return set.size;
  }, [summaryYear]);

  const legalFeesCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const value = parseFloat(item.valor_causa || '0');
      return acc + value;
    }, 0);
  }, [summaryYear]);

  const honoraryCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const value = parseFloat(item.valor_honorario || '0');
      return acc + value;
    }, 0);
  }, [summaryYear]);

  const clientFeesCount = useMemo(() => {
    return summaryYear.reduce((acc, item) => {
      const value = parseFloat(item.valor_cliente || '0');
      return acc + value;
    }, 0);
  }, [summaryYear]);

  const letOnTable = (honoraryCount + clientFeesCount) - legalFeesCount;

  const desfechoCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    summaryYear.forEach((client) => {
      const desfecho = client.desfecho ?? "Sem Desfecho";
      map[desfecho] = (map[desfecho] || 0) + 1;
    });
    return map;
  }, [summaryYear]);

  const chartData = useMemo(() => {
    return Object.entries(desfechoCountMap).map(([name, value]) => ({ name, value }));
  }, [desfechoCountMap]);

  // Exemplo de legend labels ordenadas (opcional)
  const sortedChartData = useMemo(() => {
    // opcional: ordenar por valor decrescente para melhor leitura
    return [...chartData].sort((a, b) => b.value - a.value);
  }, [chartData]);


  // 1) Descobrir desfechos presentes no summaryYear (ordenação opcional)
  const desfechos = useMemo(() => {
    const freq = new Map<string, number>();
    for (const r of summaryYear) {
      const k = (r.desfecho ?? "Não informado").trim() || "Não informado";
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    // ordenar por nome ou por frequência; aqui por frequência decrescente
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);
  }, [summaryYear]);

  // 2) Montar monthlyData: array de 12 objetos { month: 'Jan', Ganho: 2, Perdido: 1, ... }
  const monthlyData = useMemo(() => {
    // inicializar 12 meses com chaves de desfecho = 0
    const months = Array.from({ length: 12 }, (_, i) => {
      const base: Record<string, number | string> = { month: MONTH_NAMES[i] };
      for (const d of desfechos) base[d] = 0;
      return base;
    });

    for (const row of summaryYear) {
      const mIdx = extractMonthIndex(row.data_desfecho);
      if (mIdx === null) continue; // pula itens sem data_desfecho válida
      const dKey = (row.desfecho ?? "Não informado").trim() || "Não informado";
      if (!desfechos.includes(dKey)) continue; // respeita topN se houver (aqui não há)
      // @ts-expect-error propriedade dinâmica
      months[mIdx][dKey] = (months[mIdx][dKey] || 0) + 1;
    }

    return months;
  }, [summaryYear, desfechos]);

  return (
    <div className="p-4">
      <div className="gap-3 grid md:grid-cols-[repeat(auto-fill,minmax(90%,1fr))] 
                        xl:grid-cols-[repeat(auto-fill,minmax(45%,1fr))] 
                        mb-21">
        <LineGraph monthlyData={monthlyData} desfechos={desfechos} selectedYear={selectedYear} />
        <BarGraph data={sortedChartData} selectedYear={selectedYear} />
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

    </div >
  );
};
