// src/pages/Dashboard/Filters.component.tsx
import React, { useMemo } from "react";

export type PeriodType = "ano" | "semestre" | "trimestre" | "mes";

export interface FilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;

  selectedOption: string;
  onFilterOptionChange: (filterOption: string) => void;

  periodType: PeriodType;
  onPeriodTypeChange: (type: PeriodType) => void;

  periodValue: string;
  onPeriodValueChange: (val: string) => void;

  years: string[];

  filterOptions: Record<string, string>;
}

export const Filters: React.FC<FilterProps> = ({
  selectedYear,
  onYearChange,
  selectedOption,
  onFilterOptionChange,
  periodType,
  onPeriodTypeChange,
  periodValue,
  onPeriodValueChange,
  years,
  filterOptions,
}) => {
  const yearOptions = years.length > 0 ? years : ["--"];

  const periodTypeOptions: { value: PeriodType; label: string }[] = [
    { value: "ano", label: "Ano Completo" },
    { value: "semestre", label: "Semestre" },
    { value: "trimestre", label: "Trimestre" },
    { value: "mes", label: "Mês" },
  ];

  const semesterOptions = [
    { value: "0", label: "1º Semestre" },
    { value: "1", label: "2º Semestre" },
  ];

  const quarterOptions = [
    { value: "0", label: "1º Trimestre" },
    { value: "1", label: "2º Trimestre" },
    { value: "2", label: "3º Trimestre" },
    { value: "3", label: "4º Trimestre" },
  ];

  const monthOptions = [
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ];

  const currentPeriodOptions = useMemo(() => {
    switch (periodType) {
      case "semestre":
        return semesterOptions;
      case "trimestre":
        return quarterOptions;
      case "mes":
        return monthOptions;
      default:
        return [];
    }
  }, [periodType]);

  return (
    <div className="flex gap-6 mb-1 mt-0 px-4 py-2 items-center flex-wrap rounded-lg bg-card text-card-foreground border border-border shadow-card">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1.5 text-muted-foreground">Ano:</label>
        <select
          aria-label="Selecionar ano"
          className="h-6 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onChange={(e) => onYearChange(e.target.value)}
          value={selectedYear}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1.5 text-muted-foreground">Período:</label>
        <select
          aria-label="Selecionar tipo de período"
          className="h-6 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={periodType}
          onChange={(e) => onPeriodTypeChange(e.target.value as PeriodType)}
        >
          {periodTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {periodType !== "ano" && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1.5 text-muted-foreground">Seleção:</label>
          <select
            aria-label="Selecionar período específico"
            className="h-6 px-3 rounded-lg border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={periodValue}
            onChange={(e) => onPeriodValueChange(e.target.value)}
          >
            {currentPeriodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1.5 text-muted-foreground">Análise:</label>
        <select
          aria-label="Selecionar campo de agrupamento"
          className="h-6 px-3 py-1 rounded-lg border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onChange={(e) => onFilterOptionChange(e.target.value)}
          value={selectedOption}
        >
          {Object.entries(filterOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
