import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, Treemap as RechartsTreemap, Tooltip } from 'recharts';

import type { PeriodType } from "../filters/index";

interface TreemapProps {
  data: { name: string; value: number }[];
  selectedYear?: string;
  filterLabel?: string;
  periodType?: PeriodType;
  periodValue?: string;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MONTH_FULL_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const semesterLabels = ["1º Semestre", "2º Semestre"];
const quarterLabels = ["1º Trimestre", "2º Trimestre", "3º Trimestre", "4º Trimestre"];

// Cores personalizadas para o Treemap
const COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c",
  "#d0ed57", "#ffc658", "#ff8042", "#ffbb28", "#ff7300"
];

const CustomContent = (props: any) => {
  const { depth, x, y, width, height, index, name, value, colors } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[index % colors.length] : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && width > 50 && height > 30 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <title>{`${name}: ${value}`}</title>
      ) : null}
    </g>
  );
};

export const Treemap: React.FC<TreemapProps> = ({
  data,
  selectedYear,
  filterLabel = "Cidades",
  periodType = "ano",
  periodValue = "0",
}) => {

  const periodDescription = useMemo(() => {
    switch (periodType) {
      case "semestre":
        return `Semestral — ${selectedYear} (${semesterLabels[Number(periodValue) || 0]})`;
      case "trimestre":
        return `Trimestral — ${selectedYear} (${quarterLabels[Number(periodValue) || 0]})`;
      case "mes":
        return `Mensal — ${selectedYear} (${MONTH_FULL_NAMES[Number(periodValue) || 0]})`;
      case "ano":
        return `Ano — ${selectedYear}`;
      default:
        return `Ano — ${selectedYear}`;
    }
  }, [periodType, periodValue, selectedYear]);

  if (!data || data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Cidades</CardTitle>
          <CardDescription>Sem dados para exibir.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Cidade</CardTitle>
          <CardDescription>{periodDescription}</CardDescription>
        </CardHeader>

        <CardContent className="h-[300px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsTreemap
              data={data}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomContent colors={COLORS} />}
            >
              <Tooltip formatter={(value, name) => [`${value} clientes`, name]} />
            </RechartsTreemap>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Causas por {filterLabel} ao longo de {periodType === 'ano' ? selectedYear : `${selectedYear} — ${periodType === 'mes' ? MONTH_FULL_NAMES[Number(periodValue) || 0] : (periodType === 'semestre' ? semesterLabels[Number(periodValue) || 0] : quarterLabels[Number(periodValue) || 0])}`} <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
