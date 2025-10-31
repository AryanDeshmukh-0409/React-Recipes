import React, { useState } from "react";

function RecipeSearch() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  const apiUrl = "https://api.spoonacular.com/recipes/complexSearch";

  const searchRecipes = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}?apiKey=${apiKey}&query=${query}&number=12`
      );
      const data = await res.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="search-container" onSubmit={searchRecipes}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes (e.g., pasta, salad, chicken)"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
              src={recipe.image}
              alt={recipe.title}
              onError={(e) =>
                (e.target.src = "https://placehold.co/300x200?text=No+Image")
              }
            />
            <div className="info">
              <h3>{recipe.title}</h3>
              <p>
                <a
                  href={`https://spoonacular.com/recipes/${recipe.title
                    .toLowerCase()
                    .replace(/ /g, "-")}-${recipe.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Details →
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeSearch;

