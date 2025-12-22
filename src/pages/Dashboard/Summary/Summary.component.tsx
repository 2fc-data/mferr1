// src/pages/Dashboard/Summary.component.tsx
import React from "react";

import { formatBRL } from "../../../utils/Formatters";
import { UniqueClientsCount } from "../../../components/Dashboard/TotalClients/TotalClients.component";
import { ActionsCount } from "../../../components/Dashboard/TotalActions/TotalActions.component";
import { DATA_CLIENT } from "../../../data/DATA_CLIENTS";
import { LegalFeesCount } from "../../../components/Dashboard/TotalLegalFees";
import { HonoraryCount } from "../../../components/Dashboard/TotalHonorary/TotalHonorary.component";
import { FeesClientsCount } from "../../../components/Dashboard/TotalFeesClients";
import { BarGraph } from "../../../components/Dashboard/BarGraph";
import { LineGraph } from "../../../components/Dashboard/LineGraph";
import { AreaGraph } from "../../../components/Dashboard/AreaGraph";
import { RadarGraph } from "../../../components/Dashboard/RadarGraph";

import type { PeriodType } from "../../../components/Dashboard/Filters/Filters.component";
import { useSummaryData } from "../../../hooks/useSummaryData";

interface SummaryProps {
  selectedYear: string;
  selectedOption: string;
  filterOptions?: Record<string, string>;
  filterLabel?: string;
  periodType?: PeriodType;
  periodValue?: string;
}

export const Summary: React.FC<SummaryProps> = (props) => {
  const {
    uniqueClientsCount,
    actionCount,
    legalFeesCount,
    honoraryCount,
    clientFeesCount,
    letOnTable,
    monthlyData,
    barGraphData,
    dateField,
    campo,
    friendlyLabel,
    filtros,
  } = useSummaryData(props);

  return (
    <div className="p-1 w-full">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mb-3">
        <div className="w-full bg-card text-card-foreground rounded-lg border border-border shadow-card p-4">
          <UniqueClientsCount count={uniqueClientsCount} />
        </div>

        <div className="w-full bg-card text-card-foreground rounded-lg border border-border shadow-card p-4">
          <ActionsCount count={actionCount} />
        </div>

        <div className="w-full bg-card text-card-foreground rounded-lg border border-border shadow-card p-4">
          <LegalFeesCount count={legalFeesCount} />
        </div>

        <div className="w-full bg-card text-card-foreground rounded-lg border border-border shadow-card p-4">
          <HonoraryCount count={honoraryCount} />
        </div>

        <div className="w-full bg-card text-card-foreground rounded-lg border border-border shadow-card p-4">
          <FeesClientsCount count={clientFeesCount} />
        </div>

        <div className="w-full bg-card text-card-foreground rounded-lg border border-border shadow-card p-4">
          <h6 className="font-bold">Ficou na Mesa</h6>
          <h4 className="font-bold">{formatBRL(letOnTable)}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <div className="w-full">
          <LineGraph monthlyData={monthlyData} filtros={filtros} selectedYear={props.selectedYear} filterLabel={friendlyLabel} />
        </div>

        <div className="w-full">
          <BarGraph data={barGraphData} selectedYear={props.selectedYear} filterLabel={friendlyLabel} />
        </div>

        <div className="w-full">
          <AreaGraph
            rawData={DATA_CLIENT}
            dateField={dateField}
            groupField={campo}
            selectedYear={props.selectedYear}
            filterLabel={friendlyLabel}
          />
        </div>

        <div className="w-full">
          <RadarGraph
            rawData={DATA_CLIENT}
            dateField={dateField}
            groupField={campo}
            selectedYear={props.selectedYear}
            filterLabel={friendlyLabel}
            maxCategories={5}
            maxTribunals={8}
          />
        </div>
      </div>

    </div>
  );
};
