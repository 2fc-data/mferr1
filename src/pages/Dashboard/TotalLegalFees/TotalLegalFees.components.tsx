import { formatBRL } from "../../../utils/Formatters";

export interface legalFeesCountProps {
  count: number;
}

export const LegalFeesCount: React.FC<legalFeesCountProps> = ({ count }) => (
  <div>
    <h6 className="font-bold">Valor Total Processos</h6>
    <h4 className="font-bold">{formatBRL(count)}</h4>
  </div>
);
