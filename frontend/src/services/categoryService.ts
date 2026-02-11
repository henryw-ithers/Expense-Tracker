import { api } from "./api";
import type { CategoryResponse } from "../types/Category";

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await api.get<CategoryResponse[]>("/categories");
  return response.data;
};