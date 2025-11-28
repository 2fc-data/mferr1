import React from "react";

export interface FilterProps {
  selectedYear: string,
  onYearChange: (year: string) => void,
  years: string[],
}

export const Filters: React.FC<FilterProps> = ({
  selectedYear,
  onYearChange,
  years,
}) => {
  // Se não houver anos, exibe um placeholder único
  const options = years.length > 0 ? years : ["--"];

  return (
    <div className="border-t-2 flex gap-4 mb-4 mt-6 p-3">
        <label className="block text-lg font-medium mb-2">Ano:</label>
        <select
          value={selectedYear}
          onChange={e => onYearChange(e.target.value)}
          className="border p-2 rounded"
          aria-label="Selecionar ano"
        >
          {options.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

    </div>
  );
};
