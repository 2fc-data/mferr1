import { formatBRL } from "../../../utils/Formatters";

export interface totalOnTableProps {
  count: number;
}

export const TotalOnTable: React.FC<totalOnTableProps> = ({ count }) => {
  return (
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
    uppercase
  "
      >
        Na mesa:
      </h6>

      <h5
        className="
    mt-1
    text-sm
    text-accent
  "
      >
        {formatBRL(count)}
      </h5>
    </div>
  )
}
