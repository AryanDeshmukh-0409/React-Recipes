import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // ❤️ ADDED – Track if this recipe is saved

  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // ❤️ ADDED – Get logged-in user

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
        );
        const data = await res.json();
        setRecipe(data);

        // ❤️ ADDED – Check if this recipe is already favorited in JSON Server
        if (loggedInUser) {
          const favRes = await fetch(
            `http://localhost:3000/favorites?userId=${loggedInUser.id}&recipeId=${id}`
          );
          const favData = await favRes.json();
          if (favData.length > 0) setIsFavorite(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // ❤️ ADDED – Function to save recipe to favorites (matches your db.json)
  const handleAddToFavorites = async () => {
    if (!loggedInUser) {
      alert("Please log in to save recipes to favorites!");
      return;
    }

    try {
      // Check if recipe already exists in favorites
      const checkRes = await fetch(
        `http://localhost:3000/favorites?userId=${loggedInUser.id}&recipeId=${id}`
      );
      const existing = await checkRes.json();
      if (existing.length > 0) {
        setIsFavorite(true);
        alert("Recipe already in favorites ❤️");
        return;
      }

      // ❤️ ADDED – Create favorite record in "favorites" collection
      await fetch(`http://localhost:3000/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUser.id,
          recipeId: Number(id),
          title: recipe.title,
          image: recipe.image,
        }),
      });

      setIsFavorite(true);
      alert("Recipe added to your favorites ❤️");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Failed to save recipe. Try again later.");
    }
  };

  if (loading) return <p>Loading recipe details...</p>;
  if (!recipe) return <p>Recipe not found!</p>;

  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipe.title}</h1>

      <div className="recipe-header">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />

        <div className="recipe-info">
          <h3>Ready in {recipe.readyInMinutes} minutes</h3>
          <h3>Servings: {recipe.servings}</h3>
          <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>

          {/* ❤️ ADDED – Save to Favorites button */}
          <button
            onClick={handleAddToFavorites}
            disabled={isFavorite}
            style={{
              backgroundColor: isFavorite ? "gray" : "#ff4757",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: isFavorite ? "not-allowed" : "pointer",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            {isFavorite ? "Saved ❤️" : "Save to Favorites"}
          </button>
        </div>
      </div>

      <div className="recipe-section">
        <h2>Ingredients 🧂</h2>
        <ul className="ingredient-list">
          {recipe.extendedIngredients?.map((ing) => (
            <li key={ing.id}>{ing.original}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h2>Instructions 👩‍🍳</h2>
        {recipe.analyzedInstructions?.length > 0 ? (
          <ol className="instruction-list">
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        ) : (
          <p>No instructions provided.</p>
        )}
      </div>

      {recipe.nutrition && (
        <div className="recipe-section">
          <h2>Nutrition Facts 🥗</h2>
          <ul className="nutrition-list">
            {recipe.nutrition.nutrients.slice(0, 5).map((n) => (
              <li key={n.name}>
                {n.name}: {Math.round(n.amount)} {n.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
