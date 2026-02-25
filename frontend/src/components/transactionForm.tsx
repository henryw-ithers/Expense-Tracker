import { useState } from "react";
import type { CategoryResponse } from "../types/Category";
import type {
  CreateTransactionRequest,
  TransactionType,
} from "../types/Transaction";

type Props = {
  categories: CategoryResponse[];
  onSubmit: (payload: CreateTransactionRequest) => Promise<void>;
};

export function TransactionForm({ categories, onSubmit }: Props) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) return;

    const payload: CreateTransactionRequest = {
      amount,
      type,
      description,
      date,
      categoryId,
    };

    await onSubmit(payload);

    // reset form
    setAmount("");
    setDescription("");
    setDate("");
    setCategoryId("");
  };

  // If no categories exist, show message instead of broken dropdown
  if (categories.length === 0) {
    return (
      <div>
        <p>No categories available.</p>
        <p>Create a category before adding a transaction.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  );
}