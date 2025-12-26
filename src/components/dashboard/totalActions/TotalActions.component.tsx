export interface ActionsCountProps {
  count: number;
}

export const ActionsCount: React.FC<ActionsCountProps> = ({ count }) => (
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
      Causas
    </h6>

    <h5
      className="
    mt-1
    text-md
    text-accent
  "
    >
      {count}
    </h5>
  </div>
);
