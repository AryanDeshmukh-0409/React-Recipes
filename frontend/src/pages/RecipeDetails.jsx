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
  }, [id, isCustom, apiKey]);

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
  }, [id, isCustom, loggedInUser]);

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

  if (loading) return <p style={{ textAlign: "center" }}>Loading recipe details...</p>;
  if (!recipe) return <p style={{ textAlign: "center" }}>Recipe not found.</p>;

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#ff4757" }}>
        {recipe.title}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
        <div style={{ maxWidth: "500px" }}>
          {!isCustom && (
            <>
              <h3 style={{ marginBottom: "0.5rem" }}>Ready in {recipe.readyInMinutes} mins</h3>
              <h3 style={{ marginBottom: "1rem" }}>Servings: {recipe.servings}</h3>
            </>
          )}

          {/* Render HTML safely */}
          <div
            style={{ lineHeight: "1.6", color: "#333" }}
            dangerouslySetInnerHTML={{
              __html: isCustom ? recipe.instructions : recipe.summary,
            }}
          />

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
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {isFavorite ? "Saved ❤️" : "Save to Favorites"}
          </button>
        </div>
      </div>

      {/* Ingredients & Instructions Section */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#ff4757", marginBottom: "1rem" }}>Ingredients 🧂</h2>
        {isCustom ? (
          <p style={{ lineHeight: "1.6" }}>{recipe.ingredients}</p>
        ) : (
          <ul style={{ lineHeight: "1.6", color: "#333" }}>
            {recipe.extendedIngredients?.map((ing) => (
              <li key={ing.id}>{ing.original}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#ff4757", marginBottom: "1rem" }}>Instructions 👩‍🍳</h2>
        {isCustom ? (
          <p style={{ lineHeight: "1.6" }}>{recipe.instructions}</p>
        ) : recipe.analyzedInstructions?.length > 0 ? (
          <ol style={{ lineHeight: "1.6", color: "#333" }}>
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        ) : (
          <p style={{ lineHeight: "1.6" }}>No instructions available.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
