import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Detect if recipe is custom/public
  const isCustom = window.location.pathname.includes("/custom/");

  useEffect(() => {
  const fetchRecipe = async () => {
    try {
      // Check if it's a custom/public recipe
      const isCustom = window.location.pathname.includes("/custom/");
      let data;

      if (isCustom) {
        const res = await fetch(`http://localhost:3000/customRecipes/${id}`);
        data = await res.json();
      } else {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`
        );
        data = await res.json();
      }

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
      if (!isCustom && loggedInUser.id) {
        const res = await fetch(
          `http://localhost:3000/favorites?userId=${loggedInUser.id}&recipeId=${id}`
        );
        const data = await res.json();
        setIsFavorite(data.length > 0);
      } else {
        const localFavs = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(localFavs.some((f) => f.recipeId === id || f.recipeId === parseInt(id)));
      }
    };
    checkFavorite();
  }, [id, isCustom]);

  const handleAddToFavorites = async () => {
    if (!recipe) return;

    const newFavorite = {
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image,
    };

    if (!loggedInUser || !loggedInUser.id) {
      const guestFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const exists = guestFavorites.some((fav) => fav.recipeId === recipe.id);
      if (exists) return alert("Recipe already in favorites ❤️");
      localStorage.setItem("favorites", JSON.stringify([...guestFavorites, newFavorite]));
      setIsFavorite(true);
      alert("Recipe added to favorites ❤️");
      return;
    }

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
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>{recipe.title}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
        />
        <div style={{ maxWidth: "600px" }}>
          {!isCustom && (
            <>
              <h3>Ready in {recipe.readyInMinutes} minutes</h3>
              <h3>Servings: {recipe.servings}</h3>
            </>
          )}
          <p>{isCustom ? recipe.instructions : recipe.summary}</p>
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

      {isCustom ? (
        <div style={{ marginTop: "2rem" }}>
          <h2>Ingredients 🧂</h2>
          <p>{recipe.ingredients}</p>
          <h2>Instructions 👩‍🍳</h2>
          <p>{recipe.instructions}</p>
        </div>
      ) : (
        <>
          <div style={{ marginTop: "2rem" }}>
            <h2>Ingredients 🧂</h2>
            <ul>
              {recipe.extendedIngredients?.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: "2rem" }}>
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
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
