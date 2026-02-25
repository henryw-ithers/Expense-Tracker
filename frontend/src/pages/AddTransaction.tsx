import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import type { CategoryResponse } from "../types/Category";
import type {
    CreateTransactionRequest,
    TransactionResponse,
    TransactionType,
} from "../types/Transaction";
import { TransactionType as TransactionTypeValues } from "../types/Transaction";

const moneyRegex = /^\d+(\.\d{1,2})?$/;

export default function AddTransaction() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    const [form, setForm] = useState<CreateTransactionRequest>({
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        categoryId: "",
        type: TransactionTypeValues.EXPENSE,
    });

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [created, setCreated] = useState<TransactionResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoadingCategories(true);
                setCategoryError(null);

                const data = await getCategories();

                if (cancelled) return;

                setCategories(data);

                if (data.length > 0 && !form.categoryId) {
                    setForm((prev) => ({ ...prev, categoryId: data[0].id }));
                }
            } catch {
                if (cancelled) return;
                setCategoryError("Failed to load categories. Is the backend running?");
            } finally {
                if (!cancelled) setLoadingCategories(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setField = <K extends keyof CreateTransactionRequest>(
        key: K,
        value: CreateTransactionRequest[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const validate = (): string | null => {
        if (!form.description.trim()) return "Description is required.";
        if (!form.amount.trim()) return "Amount is required.";
        if (!moneyRegex.test(form.amount))
            return "Amount must be a number with up to 2 decimals (e.g., 12.34).";
        if (!form.date) return "Date is required.";
        if (!form.categoryId) return "Category is required.";
        return null;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setCreated(null);

        const err = validate();
        if (err) {
            setSubmitError(err);
            return;
        }

        setSubmitting(true);
        try {
            const result = await createTransaction(form);
            setCreated(result);

            setForm((prev) => ({
                ...prev,
                description: "",
                amount: "",
            }));
        } catch {
            setSubmitError(
                "Failed to create transaction. Check backend /api/transactions and CORS."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 520 }}>
            <h1>Add Transaction</h1>

            {loadingCategories && <p>Loading categories…</p>}
            {categoryError && <p style={{ color: "crimson" }}>{categoryError}</p>}

            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Description<br />
                        <input
                            value={form.description}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder="e.g., Groceries"
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Amount<br />
                        <input
                            value={form.amount}
                            onChange={(e) => setField("amount", e.target.value)}
                            inputMode="decimal"
                            placeholder="e.g., 12.34"
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Date<br />
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setField("date", e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Type<br />
                        <select
                            value={form.type}
                            onChange={(e) =>
                                setField("type", e.target.value as TransactionType)
                            }
                            style={{ width: "100%" }}
                        >
                            <option value={TransactionTypeValues.EXPENSE}>
                                Expense
                            </option>
                            <option value={TransactionTypeValues.INCOME}>
                                Income
                            </option>
                        </select>
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Category<br />
                        <select
                            value={form.categoryId}
                            onChange={(e) => setField("categoryId", e.target.value)}
                            disabled={loadingCategories || categories.length === 0}
                            style={{ width: "100%" }}
                        >
                            {categories.length === 0 ? (
                                <option value="">No categories</option>
                            ) : (
                                categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={submitting || loadingCategories || !!categoryError}
                >
                    {submitting ? "Saving…" : "Create"}
                </button>
            </form>

            {submitError && <p style={{ color: "crimson" }}>{submitError}</p>}

            {created && (
                <p style={{ marginTop: 12 }}>
                    Created: <strong>{created.description}</strong> —{" "}
                    {created.amount} ({created.categoryName})
                </p>
            )}
        </div>
    );
}