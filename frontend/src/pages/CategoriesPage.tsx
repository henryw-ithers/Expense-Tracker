import { useState } from "react";
import { useCategories } from "../hooks/useCategories";

export function CategoriesPage() {
  const { categories, loading, error, create } = useCategories();
  const [name, setName] = useState("");

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await create({ name: name.trim() });
    setName("");
  };

  return (
    <div>
      <h1>Categories</h1>

      <form onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
        />
        <button type="submit">Add</button>
      </form>

      {categories.length === 0 ? (
        <p>No categories yet.</p>
      ) : (
        <ul>
          {categories.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}