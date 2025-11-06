import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Fetch recipe details from Spoonacular
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`
        );
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Check if already favorite
  useEffect(() => {
    const checkFavorite = async () => {
      if (!loggedInUser) return;
      if (loggedInUser && loggedInUser.id) {
        const res = await fetch(`http://localhost:3000/favorites?userId=${loggedInUser.id}&recipeId=${id}`);
        const data = await res.json();
        setIsFavorite(data.length > 0);
      } else {
        const localFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(localFavs.some((f) => f.recipeId === parseInt(id)));
      }
    };
    checkFavorite();
  }, [id]);

  const handleAddToFavorites = async () => {
    if (!recipe) return;
    const newFavorite = {
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
    };

    // ✅ Guest user → localStorage
    if (!loggedInUser || !loggedInUser.id) {
      const guestFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const exists = guestFavorites.some((fav) => fav.recipeId === recipe.id);
      if (exists) return alert("Recipe already in favorites ❤️");
      localStorage.setItem("favorites", JSON.stringify([...guestFavorites, newFavorite]));
      setIsFavorite(true);
      alert("Recipe added to favorites ❤️");
      return;
    }

    // ✅ Logged-in user → JSON server
    try {
      const res = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newFavorite, userId: loggedInUser.id }),
      });
      if (res.ok) {
        setIsFavorite(true);
        alert("Recipe added to favorites ❤️");
      } else {
        alert("Failed to add favorite.");
      }
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  if (loading) return <p>Loading recipe details...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="recipe-details" style={{ padding: "2rem" }}>
      <h1 className="recipe-title" style={{ textAlign: "center", marginBottom: "1rem" }}>
        {recipe.title}
      </h1>

      <div className="recipe-header" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-image"
          style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
        />

        <div className="recipe-info" style={{ maxWidth: "600px" }}>
          <h3>Ready in {recipe.readyInMinutes} minutes</h3>
          <h3>Servings: {recipe.servings}</h3>
          <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>

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

      <div className="recipe-section" style={{ marginTop: "2rem" }}>
        <h2>Ingredients 🧂</h2>
        <ul>
          {recipe.extendedIngredients?.map((ing) => (
            <li key={ing.id}>{ing.original}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section" style={{ marginTop: "2rem" }}>
        <h2>Instructions 👩‍🍳</h2>
        {recipe.analyzedInstructions?.length > 0 ? (
          <ol>
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        ) : (
          <p>No instructions available.</p>
        )}
      </div>

      {recipe.nutrition && recipe.nutrition.nutrients && (
        <div className="recipe-section" style={{ marginTop: "2rem" }}>
          <h2>Nutrition Facts 🥗</h2>
          <ul>
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
