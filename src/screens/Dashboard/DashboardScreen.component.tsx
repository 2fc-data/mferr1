// src/pages/Dashboard/DashboardScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import { DATA_CLIENT } from "../../data/DATA_CLIENTS";
import { Filters } from "../../pages/Dashboard/Filters";
import { Summary } from "../../pages/Dashboard/Summary";
import { extractYearFromDesfecho } from "../../utils/dataHelpers";

/**
 * Campos permitidos para agrupamento (fixos por requisito)
 * Apenas esses serão considerados ao construir as opções dinamicamente.
 */
const ALLOWED_FILTER_FIELDS = [
  "desfecho",
  "estagio_atual",
  "status_processo",
  "tribunal",
  "vara",
] as const;

type AllowedFilterField = typeof ALLOWED_FILTER_FIELDS[number];

/** Converte 'estagio_atual' -> 'Estágio Atual' (label amigável) */
const humanize = (s: string) =>
  s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos se quiser padronizar

/**
 * Constrói o objeto filterOptions dinamicamente:
 * { desfecho: "Desfecho", estagio_atual: "Estagio Atual", ... }
 * Inclui somente campos que existam ao menos uma vez no dataset.
 */
const buildFilterOptionsFromData = (data: any[]) => {
  const options: Record<string, string> = {};
  for (const field of ALLOWED_FILTER_FIELDS) {
    // verifica se existe algum registro com valor não vazio para o campo
    const exists = data.some((r) => {
      const v = r?.[field];
      return v !== undefined && v !== null && String(v).trim() !== "";
    });
    if (exists) {
      options[field] = humanize(field);
    }
  }
  return options;
};

export const DashboardScreen: React.FC = () => {
  // anos disponíveis a partir de DATA_CLIENT (campo data_distribuicao)
  const years = useMemo(() => {
    const s = new Set<string>();
    for (const r of DATA_CLIENT) {
      const y = extractYearFromDesfecho(r.data_distribuicao);
      if (y) s.add(y);
    }
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, []);

  const initialYear = useMemo(() => years[0] ?? String(new Date().getFullYear()), [years]);

  // monta dinamicamente as opções de filtro a partir dos dados
  const FILTER_OPTIONS = useMemo(() => buildFilterOptionsFromData(DATA_CLIENT), []);

  // estado controlado: ano e opção selecionada
  const [selectedYear, setSelectedYear] = useState<string>(() => initialYear);
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    const keys = Object.keys(FILTER_OPTIONS);
    return keys[0] ?? "desfecho";
  });

  // garante selectedYear válido caso years mude
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

  // garante selectedOption válido caso FILTER_OPTIONS mude (hot-reload / dados)
  useEffect(() => {
    const keys = Object.keys(FILTER_OPTIONS);
    if (!keys.length) {
      // se nenhuma opção disponível, zera para fallback
      setSelectedOption("desfecho");
      return;
    }
    if (!keys.includes(selectedOption)) {
      setSelectedOption(keys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FILTER_OPTIONS]);

  return (
    <div>
      <Filters
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        selectedOption={selectedOption}
        onFilterOptionChange={setSelectedOption}
        years={years}
        filterOptions={FILTER_OPTIONS}
      />

      <Summary selectedYear={selectedYear} selectedOption={selectedOption} />
    </div>
  );
};
