import React, { useMemo, useState } from "react";
import { DATA_CLIENT } from "../../data/DATA_CLIENTS";
import { Filters } from "../../pages/Dashboard/Filters";
import { Summary } from "../../pages/Dashboard/Summary";

const extractYear = (dateStr?: string): string | null => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("-");
  const yearPart = parts.find(p => /^\d{4}$/.test(p));
  if (yearPart) return yearPart;
  const last = parts[parts.length - 1];
  return /^\d{4}$/.test(last) ? last : null;
};

const getYearsFromData = (data: any[]): string[] => {
  const years = data
    .map(client => extractYear(client.data_distribuicao))
    .filter((y): y is string => !!y); // filtra nulos
  // Remove duplicados e ordena (decrescente para UX comum em filtros de ano)
  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
};

export const DashboardScreen: React.FC = () => {
  const years = useMemo(() => getYearsFromData(DATA_CLIENT), []);
  // Se não houver anos, forneça um fallback visível (por exemplo o ano atual)
  const fallbackYear = years[0] ?? String(new Date().getFullYear());
  const [year, setYear] = useState<string>(fallbackYear);

  return (
    <div>
      <Filters selectedYear={year} onYearChange={setYear} years={years} />
      <Summary selectedYear={year} />
    </div>
  );
};