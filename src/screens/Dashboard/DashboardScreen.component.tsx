// src/pages/Dashboard/DashboardScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import { DATA_CLIENT } from "../../data/DATA_CLIENTS";
import { Filters } from "../../pages/Dashboard/Filters";
import { Summary } from "../../pages/Dashboard/Summary";
import { extractYear } from "../../utils/dataHelpers";

/**
 * Campos permitidos para agrupamento (fixos por requisito).
 */
const FILTER_FIELDS = [
  "area_atuacao",
  "desfecho",
  "estagio_atual",
  "status_processo",
] as const;

/** Converte 'estagio_atual' -> 'Estágio Atual' (label amigável) */
const humanize = (s: string) =>
  s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos

const buildFilterOptionsFromData = (data: any[]) => {
  const options: Record<string, string> = {};
  for (const field of FILTER_FIELDS) {
    const exists = data.some((r) => {
      const v = r?.[field];
      return v !== undefined && v !== null && String(v).trim() !== "";
    });
    if (exists) options[field] = humanize(field);
  }
  return options;
};

export const DashboardScreen: React.FC = () => {
  // anos disponíveis a partir de data_desfecho (pode adaptar se preferir outra fonte)
  const years = useMemo(() => {
    const s = new Set<string>();
    for (const r of DATA_CLIENT) {
      const y = extractYear(r.data_desfecho);
      if (y) s.add(y);
    }
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, []);

  const initialYear = useMemo(() => years[0] ?? String(new Date().getFullYear()), [years]);

  // mapa de opções amigáveis
  const filterOptions = useMemo(() => buildFilterOptionsFromData(DATA_CLIENT), []);

  // estados controlados
  const [selectedYear, setSelectedYear] = useState<string>(() => initialYear);
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    const keys = Object.keys(filterOptions);
    return keys[0] ?? "desfecho";
  });

  // garante selectedYear válido
  useEffect(() => {
    if (!years.length) {
      setSelectedYear(String(new Date().getFullYear()));
      return;
    }
    if (!years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years]);

  // garante selectedOption válido caso filterOptions mude
  useEffect(() => {
    const keys = Object.keys(filterOptions);
    if (!keys.length) {
      setSelectedOption("desfecho");
      return;
    }
    if (!keys.includes(selectedOption)) {
      setSelectedOption(keys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOptions]);

  return (
    <div>
      <Filters
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedOption={selectedOption}
        onFilterOptionChange={setSelectedOption}
        years={years}
        filterOptions={filterOptions}
      />

      <Summary
        selectedYear={selectedYear}
        selectedOption={selectedOption}
        filterOptions={filterOptions}
      />
    </div>
  );
};
