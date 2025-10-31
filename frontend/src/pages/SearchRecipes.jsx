import React, { useState } from "react";
import RecipeCard from "../components/RecipeCard";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

const SearchRecipes = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h2>🔍 Search Recipes</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name (e.g. pasta)"
        />
        <button type="submit">Search</button>
      </form>

      <div className="recipe-grid">
        {results.length > 0 ? (
          results.map((r) => <RecipeCard key={r.id} recipe={r} />)
        ) : (
          <p>No recipes found yet. Try searching!</p>
        )}
      </div>
    </div>
  );
};

export default SearchRecipes;
