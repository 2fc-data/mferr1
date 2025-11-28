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

export const Summary: React.FC<SummaryProps> = ({ selectedYear }) => {
  const summaryYear: ClientData[] = useMemo(
    () => DATA_CLIENT.filter(item => extractYear(item.data_distribuicao) === selectedYear),
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

  return (
    <div className="p-4">
      <div className="gap-3 grid md:grid-cols-[repeat(auto-fill,minmax(90%,1fr))] 
                        xl:grid-cols-[repeat(auto-fill,minmax(45%,1fr))] 
                        mb-21">
        <div>
          <BarGraph data={sortedChartData} year={selectedYear} />
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

    </div >
  );
};
