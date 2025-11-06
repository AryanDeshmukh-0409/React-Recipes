import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PublicRecipes = () => {
  const [publicRecipes, setPublicRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      try {
        const res = await fetch("http://localhost:3000/customRecipes?isPublic=true");
        const data = await res.json();
        setPublicRecipes(data);
      } catch (err) {
        console.error("Error fetching public recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicRecipes();
  }, []);

  if (loading) return <p>Loading public recipes...</p>;

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🌍 Public Recipes</h1>
      {publicRecipes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No public recipes yet.</p>
      ) : (
        <div
          className="recipe-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {publicRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
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
                src={recipe.image}
                alt={recipe.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ margin: "10px 0" }}>{recipe.title}</h3>

              <button
                onClick={() => navigate(`/recipes/custom/${recipe.id}`)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicRecipes;
