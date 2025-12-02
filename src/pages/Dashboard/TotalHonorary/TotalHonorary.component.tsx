import { formatBRL } from "../../../utils/Formatters";

export interface honoraryCountProps {
  count: number;
}

export const HonoraryCount: React.FC<honoraryCountProps> = ({ count }) => (
  <div>
    <h6 className="font-bold">Valor Total Honorários</h6>
    <h4 className="font-bold">{formatBRL(count)}</h4>
  </div>
);
