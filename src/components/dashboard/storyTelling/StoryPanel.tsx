import React, { useMemo } from "react";
import { TrendingUp, MapPin, Scale, DollarSign, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface StoryPanelProps {
  barGraphData: { name: string; value: number }[];
  cityData: { name: string; value: number }[];
  legalFeesCount: number;
  honoraryCount: number;
  clientFeesCount: number;
  friendlyLabel: string;
  selectedYear: string;
  peakMonth: string;
  peakValue: number;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({
  barGraphData,
  cityData,
  legalFeesCount,
  honoraryCount,
  clientFeesCount,
  friendlyLabel,
  selectedYear,
  peakMonth,
  peakValue,
}) => {
  const insights = useMemo(() => {
    const list = [];

    // 1. Análise Financeira
    const totalMovimentado = legalFeesCount;
    if (totalMovimentado > 0) {
      const honorariosPercent = ((honoraryCount / totalMovimentado) * 100).toFixed(1);
      const formattedClientFees = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(clientFeesCount);

      list.push({
        icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
        title: "Performance Financeira",
        text: `O montante total processual é de ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(
          totalMovimentado
        )}. Os honorários representam ${honorariosPercent}% deste valor, resultando em ${formattedClientFees} para os clientes.`,
      });
    }

    // 2. Destaque de Categoria (BarGraph)
    if (barGraphData.length > 0) {
      const topCategory = barGraphData[0];
      const totalItems = barGraphData.reduce((acc, curr) => acc + curr.value, 0);
      const percent = ((topCategory.value / totalItems) * 100).toFixed(0);

      list.push({
        icon: <Scale className="w-5 h-5 text-blue-500" />,
        title: `Destaque em ${friendlyLabel}`,
        text: `A categoria "${topCategory.name}" lidera com ${topCategory.value} registros, representando ${percent}% do total analisado neste filtro.`,
      });
    }

    // 3. Pico Temporal (LineGraph)
    if (peakValue > 0) {
      list.push({
        icon: <TrendingUp className="w-5 h-5 text-amber-500" />,
        title: "Pico de Atividade",
        text: `O período de maior atividade foi em ${peakMonth}, contabilizando ${peakValue} movimentações registradas.`,
      });
    }

    // 4. Insight Geográfico
    if (cityData.length > 0) {
      const topCity = cityData[0];
      list.push({
        icon: <MapPin className="w-5 h-5 text-rose-500" />,
        title: "Concentração Geográfica",
        text: `A cidade de ${topCity.name} concentra o maior volume de clientes (${topCity.value}), sendo um ponto focal estratégico.`,
      });
    }

    return list;
  }, [
    peakMonth,
    peakValue,
    barGraphData,
    cityData,
    legalFeesCount,
    honoraryCount,
    friendlyLabel,
  ]);

  if (insights.length === 0) return null;

  return (
    <Card className="mb-6 border-dashed border-2 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Insights Inteligentes ({selectedYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="mt-1 bg-background p-2 rounded-full shadow-sm border">
                {insight.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
