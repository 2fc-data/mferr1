import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface LineGraphProps {
  monthlyData: any;
  filtros: string[];
  selectedYear?: string;
  filterLabel?: string;
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Definindo a interface ChartConfig conforme esperado
interface ChartConfig {
  label?: string;
  icon?: React.ComponentType;
  color?: string;
  theme?: {
    light?: string;
    dark?: string;
  };
  [key: string]: any;
}

// Criando a configuração com um objeto básico
const chartConfig: ChartConfig = {
  label: "Desktop",
  color: "var(--chart-1)",
};


export const LineGraph: React.FC<LineGraphProps> = ({
  monthlyData,
  filtros,
  selectedYear,
  filterLabel,
}) => {
  const chartColors = [
    "var(--chart-primary)",
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
    "var(--chart-secondary)",
    "var(--chart-aux-1)",
    "var(--chart-aux-2)",
    "var(--chart-aux-3)",
  ];
  const colorFor = (idx: number) => chartColors[idx % chartColors.length];

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel}</CardTitle>
          <CardDescription>Mensal — {selectedYear}</CardDescription>
        </CardHeader>
      </Card>

      <CardContent className="mt-6">

        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={monthlyData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {filtros.map((filtro, i) => (
              <Line
                key={filtro}
                type="monotone"
                dataKey={filtro}
                stroke={colorFor(i)}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ChartContainer>

        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                Procesos por {filterLabel} ao longo de {selectedYear} <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                Passe o mouse para ver detalhes.
              </div>
            </div>
          </div>
        </CardFooter>
      </CardContent>
    </div>
  );
};
