import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

interface BarGraphProps {
  data: any;
  selectedYear?: string;
  filterLabel?: string;
  height?: number;
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

const chartConfig: ChartConfig = {
  label: "Desktop",
  color: "var(--chart-1)",
};

export const BarGraph: React.FC<BarGraphProps> = ({
  data,
  selectedYear,
  filterLabel,
}) => {
  const normalizedData = useMemo(() => {
    return data ?? [];
  }, [data]);

  const chartColors = [
    "var(--chart-success)",
    "var(--chart-warning)",
    "var(--chart-danger)",
    "var(--chart-neutral)",
    "var(--chart-primary)",
    "var(--chart-secondary)",
    "var(--chart-aux-1)",
    "var(--chart-aux-2)",
    "var(--chart-aux-3)",
  ];

  return (
    <div className="w-full h-fit">
      <Card>
        <CardHeader>
          <CardTitle>{filterLabel}</CardTitle>
          <CardDescription>Total — {selectedYear}</CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={normalizedData}
              margin={{ top: 20, right: 20, left: 8, bottom: 5 }}
              barCategoryGap="15%"
              barGap={10}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <Bar
                dataKey="value"
                barSize={45}
                radius={[6, 6, 0, 0]}
              >
                {normalizedData.map((_: any, idx: number) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={chartColors[idx % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
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
      </Card>
    </div>
  );
};
