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
    <div className="flex gap-6 mb-4 mt-1 px-4 py-3 items-center flex-wrap rounded">
      <div className="flex flex-col">
        <label className="text-md font-small mb-1">Ano:</label>
        <select
          aria-label="Selecionar ano"
          className="border rounded"
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
        <label className="text-md font-small mb-1">Análise:</label>
        <select
          aria-label="Selecionar campo de agrupamento"
          className="border rounded"
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
