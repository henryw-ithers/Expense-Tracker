import { useCallback, useEffect, useState } from "react";
import type { CategoryResponse, CreateCategoryRequest } from "../types/Category";
import { getCategories, createCategory } from "../services/categoryService";

type UseCategoriesResult = {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (payload: CreateCategoryRequest) => Promise<CategoryResponse>;
};

function toMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  return fallback;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(toMessage(e, "Failed to load categories"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: CreateCategoryRequest) => {
    setError(null);
    const created = await createCategory(payload);
    setCategories((prev) => [created, ...prev]);
    return created;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { categories, loading, error, refresh, create };
}