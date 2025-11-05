import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); // ❤️ ADDED – Store user's favorite recipes
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // ❤️ ADDED – Get current user

  // ❤️ Fetch user's favorites from db.json
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!loggedInUser) {
        alert("Please log in to view your favorite recipes.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/favorites?userId=${loggedInUser.id}`
        );
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ❤️ Remove a recipe from favorites
  const handleRemove = async (favoriteId) => {
    try {
      await fetch(`http://localhost:3000/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      alert("Recipe removed from favorites 💔");
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove recipe. Try again later.");
    }
  };

  if (loading) return <p>Loading your favorite recipes...</p>;

  return (
    <div className="favorites-page" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        ❤️ Your Favorite Recipes
      </h1>

      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          You have no saved recipes yet. Start exploring and save some!
        </p>
      ) : (
        <div
          className="favorites-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="favorite-card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                background: "white",
                textAlign: "center",
              }}
            >
              <img
                src={fav.image}
                alt={fav.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ margin: "10px 0" }}>{fav.title}</h3>

              <div
                className="favorite-actions"
                style={{ display: "flex", justifyContent: "center", gap: "10px" }}
              >
                {/* ❤️ View details button */}
                <button
                  onClick={() => navigate(`/recipes/${fav.recipeId}`)}
                  style={{
                    backgroundColor: "#1e90ff",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>

                {/* 💔 Remove button */}
                <button
                  onClick={() => handleRemove(fav.id)}
                  style={{
                    backgroundColor: "#ff4757",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
