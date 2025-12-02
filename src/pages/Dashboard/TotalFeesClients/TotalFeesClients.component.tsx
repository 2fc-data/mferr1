import { formatBRL } from "../../../utils/Formatters";

export interface feesClientsCountProps {
  count: number;
}

export const FeesClientsCount: React.FC<feesClientsCountProps> = ({ count }) => (
  <div>
    <h6 className="font-bold">Valor Total Ganho Clientes</h6>
    <h4 className="font-bold">{formatBRL(count)}</h4>
  </div>
);
