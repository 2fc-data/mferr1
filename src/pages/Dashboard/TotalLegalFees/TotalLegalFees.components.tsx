import { formatBRL } from "../../../utils/Formatters";

export interface legalFeesCountProps {
  count: number;
}

export const LegalFeesCount: React.FC<legalFeesCountProps> = ({ count }) => (
  <div>
    <h6 className="font-bold">Total Causas</h6>
    <h4 className="font-bold">{formatBRL(count)}</h4>
  </div>
);
