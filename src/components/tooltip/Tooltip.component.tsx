// GraphTooltip.tsx
import React from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

export const GraphTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  // 🔥 Filtra valores iguais a zero
  const filtered = payload.filter((item) => Number(item.value) !== 0);

  // Se tudo for zero, não mostra tooltip
  if (filtered.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--color-light)",
        padding: "8px 10px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        fontSize: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>

      {filtered.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: item.color,
              borderRadius: "50%",
              display: "inline-block",
            }}
          />

          <span>{item.name}: </span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
};
