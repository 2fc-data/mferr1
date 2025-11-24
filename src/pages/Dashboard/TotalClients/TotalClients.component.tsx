export interface UniqueClientsCountProps {
  count: number;
}

export const UniqueClientsCount: React.FC<UniqueClientsCountProps> = ({ count }) => (
  <div>
    <h6 className="font-bold">Total Clientes</h6>
    <h4 className="font-bold">{count}</h4>
  </div>
);
