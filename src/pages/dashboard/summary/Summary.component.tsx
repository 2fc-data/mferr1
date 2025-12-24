// src/pages/Dashboard/Summary.component.tsx
import React from "react";

import { DATA_CLIENT } from "../../../data/DATA_CLIENTS";
import { UniqueClientsCount } from "../../../components/dashboard/totalClients";
import { ActionsCount } from "../../../components/dashboard/totalActions";
import { LegalFeesCount } from "../../../components/dashboard/totalLegalFees";
import { HonoraryCount } from "../../../components/dashboard/totalHonorary";
import { FeesClientsCount } from "../../../components/dashboard/totalFeesClients";
import { TotalOnTable } from "@/components/dashboard/totalOnTable";
import { BarGraph } from "../../../components/dashboard/barGraph";
import { LineGraph } from "../../../components/dashboard/lineGraph";
import { AreaGraph } from "../../../components/dashboard/areaGraph";
import { RadarGraph } from "../../../components/dashboard/radarGraph";

import type { PeriodType } from "../../../components/dashboard/filters";
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
    onTable,
    monthlyData,
    barGraphData,
    dateField,
    campo,
    friendlyLabel,
    filtros,
  } = useSummaryData(props);

  return (
    <div className="w-full">
      <div className="
      grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] 
      md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]       
      gap-4 mb-3"
      >
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
          <TotalOnTable count={ onTable } />
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
          <RadarGraph
            rawData={DATA_CLIENT}
            dateField={dateField}
            groupField={campo}
            selectedYear={props.selectedYear}
            filterLabel={friendlyLabel}
            maxCategories={5}
            maxTribunals={8}
            periodType={props.periodType}
            periodValue={props.periodValue}
          />
        </div>

        <div className="w-full">
          <AreaGraph
            rawData={DATA_CLIENT}
            dateField={dateField}
            groupField={campo}
            selectedYear={props.selectedYear}
            filterLabel={friendlyLabel}
            periodType={props.periodType}
            periodValue={props.periodValue}
          />
        </div>

      </div>

    </div>
  );
};
