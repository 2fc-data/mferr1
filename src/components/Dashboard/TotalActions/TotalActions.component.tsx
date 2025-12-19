export interface ActionsCountProps {
  count: number;
}

export const ActionsCount: React.FC<ActionsCountProps> = ({ count }) => (
  <div>
    <h6 className="font-bold">Total Ações</h6>
    <h4 className="font-bold">{count}</h4>
  </div>
);
