import type { TransactionResponse } from "../types/Transaction";

type Props = {
  transactions: TransactionResponse[];
  onDelete?: (id: string) => Promise<void> | void;
};

export function TransactionTable({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return <p>No transactions yet.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Type</th>
          <th>Amount</th>
          {onDelete ? <th></th> : null}
        </tr>
      </thead>

      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td>{t.date}</td>
            <td>{t.description}</td>
            <td>{t.categoryName ?? t.categoryId}</td>
            <td>{t.type}</td>
            <td>{t.amount}</td>
            {onDelete ? (
              <td>
                <button type="button" onClick={async () => await onDelete?.(t.id)}>
                  Delete
                </button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}