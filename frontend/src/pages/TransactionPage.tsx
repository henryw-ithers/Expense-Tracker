import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Card } from "../components/ui/Card";
import { theme } from "../theme/theme";
import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import type {
  CreateTransactionRequest,
  TransactionResponse,
} from "../types/Transaction";
import type { CreateCategoryRequest } from "../types/Category";

const CATEGORY_COLORS_STORAGE_KEY = "finance-tracker-category-colors";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

function getGeneratedCategoryColor(categoryName: string): string {
  let hash = 0;

  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

function readStoredCategoryColors(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CATEGORY_COLORS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredCategoryColors(colors: Record<string, string>) {
  localStorage.setItem(CATEGORY_COLORS_STORAGE_KEY, JSON.stringify(colors));
}

export function TransactionsPage() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    create: createTransaction,
    remove: removeTransaction,
  } = useTransactions();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    create: createCategory,
  } = useCategories();

  const [formData, setFormData] = useState<CreateTransactionRequest>({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    type: "EXPENSE",
  });

  const [categoryForm, setCategoryForm] = useState<CreateCategoryRequest>({
    name: "",
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categorySubmitError, setCategorySubmitError] = useState<string | null>(null);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});

  useEffect(() => {
    setCategoryColors(readStoredCategoryColors());
  }, []);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return sortedTransactions.filter((transaction) => {
      const matchesSearch =
        query.length === 0 ||
        transaction.categoryName.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "ALL" || transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "ALL" || transaction.categoryId === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [sortedTransactions, searchTerm, typeFilter, categoryFilter]);

  const transactionTotals = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const transaction of filteredTransactions) {
      if (transaction.type === "INCOME") income += transaction.amount;
      if (transaction.type === "EXPENSE") expense += transaction.amount;
    }

    return {
      income,
      expense,
      net: income - expense,
    };
  }, [filteredTransactions]);

  function getCategoryColor(categoryId: string, categoryName: string): string {
    return categoryColors[categoryId] ?? getGeneratedCategoryColor(categoryName);
  }

  function handleTransactionChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCategoryForm({ name: event.target.value });
  }

  async function handleTransactionSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitError(null);

    if (!formData.amount.trim()) {
      setSubmitError("Please enter an amount.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setSubmitError("Amount must be greater than 0.");
      return;
    }

    if (!formData.categoryId) {
      setSubmitError("Please select a category.");
      return;
    }

    try {
      setIsSubmittingTransaction(true);

      await createTransaction(formData);

      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        categoryId: "",
        type: "EXPENSE",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create transaction."
      );
    } finally {
      setIsSubmittingTransaction(false);
    }
  }

  async function handleCreateCategory() {
    setCategorySubmitError(null);

    const trimmedName = categoryForm.name.trim();

    if (!trimmedName) {
      setCategorySubmitError("Please enter a category name.");
      return;
    }

    try {
      setIsSubmittingCategory(true);

      const createdCategory = await createCategory({ name: trimmedName });

      setCategoryForm({ name: "" });
      setShowCategoryForm(false);

      setFormData((prev) => ({
        ...prev,
        categoryId: createdCategory.id,
      }));

      setCategoryColors((prev) => {
        const next = {
          ...prev,
          [createdCategory.id]: getGeneratedCategoryColor(createdCategory.name),
        };
        writeStoredCategoryColors(next);
        return next;
      });
    } catch (error) {
      setCategorySubmitError(
        error instanceof Error ? error.message : "Failed to create category."
      );
    } finally {
      setIsSubmittingCategory(false);
    }
  }

  async function handleDeleteTransaction(id: string) {
    try {
      await removeTransaction(id);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to delete transaction."
      );
    }
  }

  function handleCategoryColorChange(categoryId: string, color: string) {
    setCategoryColors((prev) => {
      const next = {
        ...prev,
        [categoryId]: color,
      };
      writeStoredCategoryColors(next);
      return next;
    });
  }

  return (
    <PageContainer>
      <div className="mb-4">
        <SectionTitle className="mb-2">Transactions</SectionTitle>
        <p
          className="mb-0"
          style={{
            color: theme.colors.textMuted,
            fontSize: theme.fontSizes.sm,
          }}
        >
          Search your history, add transactions, and manage categories in one place.
        </p>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <Card>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
              <SectionTitle className="mb-0">Transaction History</SectionTitle>
              <span
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes.xs,
                }}
              >
                {filteredTransactions.length} shown
              </span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search category, description, or type"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value as "ALL" | "INCOME" | "EXPENSE")
                  }
                >
                  <option value="ALL">All types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="ALL">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-3">
              <div
                style={{
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textMuted,
                }}
              >
                Income:{" "}
                <span style={{ color: theme.colors.text }}>
                  {formatCurrency(transactionTotals.income)}
                </span>
              </div>

              <div
                style={{
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textMuted,
                }}
              >
                Expenses:{" "}
                <span style={{ color: theme.colors.text }}>
                  {formatCurrency(transactionTotals.expense)}
                </span>
              </div>

              <div
                style={{
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textMuted,
                }}
              >
                Net:{" "}
                <span style={{ color: theme.colors.text }}>
                  {formatCurrency(transactionTotals.net)}
                </span>
              </div>
            </div>

            {transactionsLoading ? (
              <p
                className="mb-0"
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                Loading transactions...
              </p>
            ) : filteredTransactions.length === 0 ? (
              <p
                className="mb-0"
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                No transactions match your current filters.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction: TransactionResponse) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleDateString("en-CA")}</td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: getCategoryColor(
                                  transaction.categoryId,
                                  transaction.categoryName
                                ),
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                            />
                            <span>{transaction.categoryName}</span>
                          </div>
                        </td>

                        <td>{transaction.type}</td>

                        <td style={{ color: theme.colors.textMuted }}>
                          {transaction.description || "—"}
                        </td>

                        <td
                          className="text-end"
                          style={{
                            color:
                              transaction.type === "INCOME"
                                ? theme.colors.accent
                                : theme.colors.secondary,
                            fontWeight: theme.fontWeights.bold,
                          }}
                        >
                          {transaction.type === "EXPENSE" ? "-" : "+"}
                          {formatCurrency(Number(transaction.amount))}
                        </td>

                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => void handleDeleteTransaction(transaction.id)}
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.12)",
                              color: theme.colors.secondary,
                              border: "1px solid rgba(239, 68, 68, 0.22)",
                              borderRadius: theme.radii.md,
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="col-12 col-xl-7">
          <Card>
            <SectionTitle className="mb-3">Add Transaction</SectionTitle>

            <form onSubmit={handleTransactionSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6 col-xl-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    value={formData.amount}
                    onChange={handleTransactionChange}
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-12 col-md-6 col-xl-3">
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleTransactionChange}
                    className="form-select"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 col-xl-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleTransactionChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-6 col-xl-3">
                  <label className="form-label">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleTransactionChange}
                    className="form-select"
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading categories..." : "Select category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleTransactionChange}
                    className="form-control"
                    placeholder="Optional description"
                  />
                </div>

                <div className="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="btn"
                    disabled={isSubmittingTransaction}
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.text,
                      border: "none",
                      borderRadius: theme.radii.md,
                      fontWeight: theme.fontWeights.medium,
                      padding: "0.75rem 1rem",
                    }}
                  >
                    {isSubmittingTransaction ? "Adding..." : "Add Transaction"}
                  </button>
                </div>

                {(submitError || transactionsError || categoriesError) && (
                  <div className="col-12">
                    <div
                      style={{
                        color: theme.colors.secondary,
                        fontSize: theme.fontSizes.sm,
                      }}
                    >
                      {submitError || transactionsError || categoriesError}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>

        <div className="col-12 col-xl-5">
          <Card className="h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <SectionTitle className="mb-0">Categories</SectionTitle>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setShowCategoryForm((prev) => !prev)}
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.14)",
                  color: theme.colors.text,
                  border: "1px solid rgba(59, 130, 246, 0.24)",
                  borderRadius: theme.radii.md,
                }}
              >
                {showCategoryForm ? "Close" : "+ New Category"}
              </button>
            </div>

            {showCategoryForm && (
              <div
                style={{
                  marginBottom: theme.spacing.lg,
                  padding: theme.spacing.md,
                  borderRadius: theme.radii.md,
                  border: "1px solid rgba(148, 163, 184, 0.12)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <div className="row g-3 align-items-end">
                  <div className="col-12">
                    <label className="form-label mb-2">New Category Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={handleCategoryChange}
                      className="form-control"
                      placeholder="e.g. Groceries"
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="button"
                      className="btn w-100"
                      disabled={isSubmittingCategory}
                      onClick={() => void handleCreateCategory()}
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.text,
                        border: "none",
                        borderRadius: theme.radii.md,
                        fontWeight: theme.fontWeights.medium,
                        padding: "0.75rem 1rem",
                      }}
                    >
                      {isSubmittingCategory ? "Creating..." : "Create Category"}
                    </button>
                  </div>

                  {categorySubmitError && (
                    <div className="col-12">
                      <div
                        style={{
                          color: theme.colors.secondary,
                          fontSize: theme.fontSizes.sm,
                        }}
                      >
                        {categorySubmitError}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {categoriesLoading ? (
              <p
                className="mb-0"
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                Loading categories...
              </p>
            ) : categories.length === 0 ? (
              <p
                className="mb-0"
                style={{
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes.sm,
                }}
              >
                No categories yet.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {categories.map((category) => {
                  const color = getCategoryColor(category.id, category.name);

                  return (
                    <div
                      key={category.id}
                      className="d-flex align-items-center justify-content-between gap-3"
                      style={{
                        paddingBottom: theme.spacing.sm,
                        borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2 min-w-0">
                        <span
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: color,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            color: theme.colors.text,
                            fontSize: theme.fontSizes.sm,
                          }}
                        >
                          {category.name}
                        </span>
                      </div>

                      <input
                        type="color"
                        value={color}
                        onChange={(event) =>
                          handleCategoryColorChange(category.id, event.target.value)
                        }
                        title={`Choose color for ${category.name}`}
                        style={{
                          width: "40px",
                          height: "32px",
                          padding: 0,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}