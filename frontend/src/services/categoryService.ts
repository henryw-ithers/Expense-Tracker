import { api } from "./api";
import type {
  CategoryResponse,
  CreateCategoryRequest,
} from "../types/Category";

export async function getCategories(): Promise<CategoryResponse[]> {
  const res = await api.get<CategoryResponse[]>("/api/categories");
  return res.data;
}

export async function getCategoryById(
  id: string
): Promise<CategoryResponse> {
  const res = await api.get<CategoryResponse>(`/api/categories/${id}`);
  return res.data;
}

export async function createCategory(
  payload: CreateCategoryRequest
): Promise<CategoryResponse> {
  const res = await api.post<CategoryResponse>(
    "/api/categories",
    payload
  );
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/categories/${id}`);
}