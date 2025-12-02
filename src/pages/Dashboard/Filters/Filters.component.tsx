// src/pages/Dashboard/Filters.component.tsx
import React from "react";

export interface FilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;

  selectedOption: string;
  onFilterOptionChange: (filterOption: string) => void;

  years: string[];

  filterOptions: Record<string, string>;
}

export const Filters: React.FC<FilterProps> = ({
  selectedYear,
  onYearChange,
  selectedOption,
  onFilterOptionChange,
  years,
  filterOptions,
}) => {
  const yearOptions = years.length > 0 ? years : ["--"];

  return (
    <div className="border-t-2 flex gap-6 mb-4 mt-6 p-3 items-center flex-wrap">
      <div className="flex flex-col">
        <label className="text-lg font-medium mb-1">Ano:</label>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="border p-2 rounded"
          aria-label="Selecionar ano"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-medium mb-1">Análise:</label>
        <select
          value={selectedOption}
          onChange={(e) => onFilterOptionChange(e.target.value)}
          className="border p-2 rounded"
          aria-label="Selecionar campo de agrupamento"
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
