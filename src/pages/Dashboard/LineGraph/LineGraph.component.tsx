import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { type ClientData } from "../../../types/ClientData.interface";

interface LineStatusChartProps {
  summaryYear: ClientData[];        // dados já filtrados para o ano
  selectedYear: string;            // ano para título/legenda
  desfecho?: string[];             // lista explícita de desfechos (opcional)
  colorMap?: Record<string, string>; // mapa desfecho -> cor (opcional)
  height?: number;                 // altura do gráfico em px (opcional, default 350)
}

/**
 * Month labels em português — use conforme desejar
 */
const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const DEFAULT_COLORS = [
  "#16a34a", // verde - Ganho
  "#2563eb", // azul  - Acordo
  "#dc2626", // vermelho - Perdido
  "#f59e0b", // âmbar - negociação/outros
  "#6b7280", // cinza
  "#7c3aed", // roxo
  "#0ea5e9", // ciano
];

export const LineGraph: React.FC<LineStatusChartProps> = ({
  summaryYear,
  selectedYear,
  desfecho,
  colorMap,
  height = 350,
}) => {
  /**
   * 1) Descobre lista determinística de desfechos se `desfecho` não foi passada.
   *    Mantemos ordem estável: ordem de aparição nos dados.
   */
  const resolvedstatus = useMemo(() => {
    if (Array.isArray(desfecho) && desfecho.length > 0) return desfecho;

    const set = new Set<string>();
    for (const item of summaryYear) {
      const key = item.desfecho?.trim() ?? "Outro";
      if (!set.has(key)) set.add(key);
    }
    return Array.from(set);
  }, [desfecho, summaryYear]);

  /**
   * 2) Monta os 12 meses com contadores para cada desfecho
   */
  const chartData = useMemo(() => {
    // inicializa 12 meses
    const months = Array.from({ length: 12 }, (_, i) => ({ month: MONTH_NAMES[i] }));

    // pre-popula chaves com zero (garante consistência de shape)
    for (const m of months) {
      for (const s of resolvedstatus) {
        // @ts-expect-error adicionando dinamicamente propriedades de desfecho
        m[s] = 0;
      }
    }

    // incrementa contadores a partir de data_desfecho (dd-mm-yyyy)
    for (const item of summaryYear) {
      if (!item.data_desfecho) continue;
      const parts = item.data_desfecho.split("-");
      if (parts.length < 3) continue;
      const monthIndex = Number(parts[1]) - 1;
      if (!Number.isFinite(monthIndex) || monthIndex < 0 || monthIndex > 11) continue;

      const key = item.desfecho?.trim() ?? "Outro";
      // só incrementa se o key estiver na lista resolvida (caso passe desfecho específicos)
      if (!resolvedstatus.includes(key)) continue;

      // @ts-expect-error propriedade dinâmica
      months[monthIndex][key] = (months[monthIndex][key] || 0) + 1;
    }

    return months;
  }, [summaryYear, resolvedstatus]);

  /**
   * 3) Resolve cores: colorMap tem prioridade, caso contrário usa DEFAULT_COLORS em loop.
   */
  const colorFor = useMemo(() => {
    return (desfecho: string, idx: number) => {
      if (colorMap && colorMap[desfecho]) return colorMap[desfecho];
      return DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    };
  }, [colorMap]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Desfechos por mês — {selectedYear}</h3>

      <div  style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />

            {resolvedstatus.map((s, i) => (
              <Line
                key={s}
                type="monotone"
                dataKey={s}
                stroke={colorFor(s, i)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
