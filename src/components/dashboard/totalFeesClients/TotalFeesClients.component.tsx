import { formatBRLCompact } from "../../../utils/Formatters";

export interface feesClientsCountProps {
  count: number;
}

export const FeesClientsCount: React.FC<feesClientsCountProps> = ({ count }) => (
  <div
    className="
      rounded-xl
      bg-card text-card-foreground
      p-2
      shadow-(--shadow-card)
      border border-border
      transition-all
      hover:shadow-(--shadow-gold)
    "
  >
    <h6
      className="
        text-md
        font-semibold
        text-muted-foreground
        tracking-wide
      "
    >
      Clientes
    </h6>

    <h5
      className="
        mt-1
        text-md
        text-accent
      "
    >
      {formatBRLCompact(count)}
    </h5>
  </div>
);
