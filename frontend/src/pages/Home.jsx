import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

const Home = () => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRandom = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/random?number=1&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setRecipe(data.recipes[0]);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };

    fetchRandom();
  }, []);

  return (
    <div className="page-container">
      <h2>🍴 Recipe of the Day</h2>
      {recipe ? <RecipeCard recipe={recipe} /> : <p>Loading...</p>}
      <button
        className="search-btn"
        onClick={() => (window.location.href = "/guest/search")}
      >
        🔍 Search Recipes
      </button>
    </div>
  );
};

export default Home;

