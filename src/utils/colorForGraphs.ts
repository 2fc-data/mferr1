// src/utils/colorForStatus.ts
export type ColorMapping = Record<string, string>;

/**
 * Retorna cor CSS para um status, usando variáveis definidas em index.css.
 * - status: string (nome do status vindo do DATA_CLIENT)
 * - index: number (usado para fallback cíclico)
 * - overrides: opcional para mapear nomes de status customizados para variáveis CSS
 *
 * Ex.: colorForStatus("Concluído", 0) -> lê --chart-success
 */
export const colorForGraphs = (
  status: string,
  index: number,
  overrides?: ColorMapping,
): string => {
  // SSR fallback
  if (typeof window === "undefined" || typeof document === "undefined") {
    const fallback = [
      "#22c55e", // success
      "#f59e0b", // warning
      "#ef4444", // danger
      "#6b7280", // neutral
      "#60a5fa",
      "#a78bfa",
      "#34d399",
    ];
    return fallback[index % fallback.length];
  }

  const getVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || null;

  const defaultMapping: ColorMapping = {
    "Concluído": "--chart-success",
    "Concluido": "--chart-success",
    "Ganho": "--chart-success",
    "Perdido": "--chart-danger",
    "Em Andamento": "--chart-warning",
    "EmAndamento": "--chart-warning",
    "Negociação": "--chart-warning",
    "Negociacao": "--chart-warning",
    "Acordo": "--chart-aux-1",
    "Sem Desfecho": "--chart-neutral",
    "SemDesfecho": "--chart-neutral",
    // adicione outros nomes usados no seu DATA_CLIENT se necessário
  };

  const mapping: ColorMapping = { ...defaultMapping, ...(overrides ?? {}) };

  const auxVars = [
    "--chart-aux-1",
    "--chart-aux-2",
    "--chart-aux-3",
    "--chart-primary",
    "--chart-secondary",
  ];

  const varName = mapping[status] ?? auxVars[index % auxVars.length];
  const color = getVar(varName);
  if (color) return color;

  // tenta ciclo por auxVars (a partir do index para variar)
  for (let i = 0; i < auxVars.length; i++) {
    const c = getVar(auxVars[(index + i) % auxVars.length]);
    if (c) return c;
  }

  // último fallback estático
  return "#6b7280";
};
