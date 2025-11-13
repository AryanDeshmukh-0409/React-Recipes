import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [usersMap, setUsersMap] = useState({});

  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const isCustom = window.location.pathname.includes("/custom/");

  // Fetch recipe details
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
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:3000/reviews?recipeId=${id}`);
        const data = await res.json();
        setReviews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [id]);

  // Fetch all users to map IDs to names
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        const data = await res.json();
        const map = {};
        data.forEach(u => {
          map[u.id.toString()] = u.name;
        });
        setUsersMap(map);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Handle add to favorites
  const handleAddToFavorites = async () => {
    if (!recipe) return;
    const newFavorite = { recipeId: recipe.id, title: recipe.title, image: recipe.image };

    if (!loggedInUser || !loggedInUser.id) {
      const guestFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (guestFavorites.some(fav => fav.recipeId === recipe.id)) return alert("Already in favorites ❤️");
      localStorage.setItem("favorites", JSON.stringify([...guestFavorites, newFavorite]));
      setIsFavorite(true);
      alert("Added to favorites ❤️");
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
        alert("Added to favorites ❤️");
      } else {
        alert("Failed to add favorite.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 📤 Share handlers (copy / twitter / whatsapp / email)
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this recipe: ${recipe?.title || ""}`;
    if (platform === "copy") {
      // clipboard API with fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          alert("Link copied to clipboard!");
        }).catch(() => {
          prompt("Copy this link:", url);
        });
      } else {
        prompt("Copy this link:", url);
      }
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (platform === "email") {
      window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`);
    }
  };

  // Handle review form
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!loggedInUser) return alert("You must be logged in to submit a review.");

    const reviewToSubmit = {
      recipeName: recipe.title,
      recipeId: recipe.id,
      userId: loggedInUser.id,
      rating: parseInt(newReview.rating),
      comment: newReview.comment,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewToSubmit),
      });
      if (res.ok) {
        setReviews([reviewToSubmit, ...reviews]);
        setNewReview({ rating: 5, comment: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading recipe details...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "2.2rem", color: "#1e1e1e" }}>
        {recipe.title}
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        />

        <div style={{ maxWidth: "600px" }}>
          {!isCustom && (
            <>
              <h3 style={{ color: "#333" }}>Ready in {recipe.readyInMinutes} minutes</h3>
              <h3 style={{ color: "#333" }}>Servings: {recipe.servings}</h3>
            </>
          )}
          <p
            style={{ color: "#555", lineHeight: "1.6", marginTop: "1rem" }}
            dangerouslySetInnerHTML={isCustom ? null : { __html: recipe.summary }}
          >
            {isCustom ? recipe.instructions : null}
          </p>
          <button
            onClick={handleAddToFavorites}
            disabled={isFavorite}
            style={{
              backgroundColor: isFavorite ? "gray" : "#ff4757",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              marginTop: "15px",
              cursor: isFavorite ? "not-allowed" : "pointer",
              fontWeight: "500",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => !isFavorite && (e.currentTarget.style.backgroundColor = "#e03e4e")}
            onMouseLeave={e => !isFavorite && (e.currentTarget.style.backgroundColor = "#ff4757")}
          >
            {isFavorite ? "Saved ❤️" : "Save to Favorites"}
          </button>

          {/* 🔗 Share Buttons (added, rest unchanged) */}
          <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button onClick={() => handleShare("copy")} style={shareBtnStyle}>📋 Copy Link</button>
            <button onClick={() => handleShare("twitter")} style={shareBtnStyle}>🐦 Twitter</button>
            <button onClick={() => handleShare("whatsapp")} style={shareBtnStyle}>💬 WhatsApp</button>
            <button onClick={() => handleShare("email")} style={shareBtnStyle}>✉️ Email</button>
          </div>
        </div>
      </div>

      {/* Ingredients & Instructions */}
      <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ color: "#333", marginBottom: "0.8rem" }}>Ingredients 🧂</h2>
          {isCustom ? (
            <p style={{ color: "#555", lineHeight: "1.5" }}>{recipe.ingredients}</p>
          ) : (
            <ul style={{ color: "#555", lineHeight: "1.6", paddingLeft: "1.2rem" }}>
              {recipe.extendedIngredients?.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ color: "#333", marginBottom: "0.8rem" }}>Instructions 👩‍🍳</h2>
          {isCustom ? (
            <p style={{ color: "#555", lineHeight: "1.5" }}>{recipe.instructions}</p>
          ) : recipe.analyzedInstructions?.length > 0 ? (
            <ol style={{ color: "#555", lineHeight: "1.6", paddingLeft: "1.2rem" }}>
              {recipe.analyzedInstructions[0].steps.map((step) => (
                <li key={step.number}>{step.step}</li>
              ))}
            </ol>
          ) : (
            <p style={{ color: "#555", fontStyle: "italic" }}>No instructions available.</p>
          )}
        </div>
      </div>

      {/* Nutrition */}
      {!isCustom && recipe.nutrition?.nutrients && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#333", marginBottom: "0.8rem" }}>Nutrition 🥗</h2>
          <ul style={{ color: "#555", lineHeight: "1.5", paddingLeft: "1.2rem" }}>
            {recipe.nutrition.nutrients.slice(0, 5).map((n) => (
              <li key={n.name}>{n.name}: {Math.round(n.amount)} {n.unit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.8rem", color: "#333" }}>Reviews 📝</h2>
        {reviews.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No reviews yet. Be the first to write one!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {reviews.map((rev) => {
              const userName = usersMap[rev.userId.toString()] || `User ${rev.userId}`;
              const date = new Date(rev.date).toLocaleDateString(undefined, {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
              });

              return (
                <li
                  key={rev.id || rev.date}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "1rem 1.2rem",
                    background: "#f9f9f9",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: "#333" }}>{userName}</strong>
                    <span style={{ color: "#ffb400", fontWeight: "500" }}>⭐ {rev.rating}/5</span>
                  </div>
                  <p style={{ marginTop: "0.5rem", color: "#555", lineHeight: "1.5" }}>{rev.comment}</p>
                  <small style={{ color: "#999" }}>{date}</small>
                </li>
              );
            })}
          </ul>
        )}

        {/* Add review form */}
        <form
          onSubmit={handleSubmitReview}
          style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.7rem", maxWidth: "500px" }}
        >
          <label style={{ fontWeight: "500", color: "#333" }}>
            Rating:
            <select
              name="rating"
              value={newReview.rating}
              onChange={handleReviewChange}
              style={{
                marginLeft: "0.5rem",
                padding: "5px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontWeight: "500"
              }}
            >
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: "500", color: "#333" }}>
            Comment:
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              rows="3"
              placeholder="Write your review..."
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "0.95rem",
                resize: "vertical",
              }}
              required
            />
          </label>
          <button
            type="submit"
            style={{
              backgroundColor: "#1e90ff",
              color: "white",
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0c7cd5"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1e90ff"}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

// Modern share button style (kept separate so it's reusable)
const shareBtnStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "8px 14px",
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.2s",
  fontWeight: "500",
};

export default RecipeDetails;
