import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const diets = [
  "gluten free",
  "ketogenic",
  "vegetarian",
  "vegan",
  "pescatarian",
  "paleo",
  "primal",
  "low FODMAP",
  "whole30",
];

const intolerances = [
  "dairy",
  "egg",
  "gluten",
  "peanut",
  "seafood",
  "sesame",
  "shellfish",
  "soy",
  "sulfite",
  "tree nut",
  "wheat",
];

const AdvancedSearch = () => {
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedIntolerances, setSelectedIntolerances] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

  // Handle checkbox toggle
  const handleToggle = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (ingredients) queryParams.append("includeIngredients", ingredients);
      if (selectedDiets.length) queryParams.append("diet", selectedDiets.join(","));
      if (selectedIntolerances.length)
        queryParams.append("intolerances", selectedIntolerances.join(","));
      queryParams.append("number", "20"); // limit results
      queryParams.append("apiKey", apiKey);

      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${queryParams.toString()}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        🔍 Advanced Recipe Search
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "600px",
          margin: "0 auto 2rem",
        }}
      >
        {/* Ingredients Input */}
        <input
          type="text"
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        {/* Diet Checkboxes */}
        <div>
          <h3>Select Diet(s):</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {diets.map((diet) => (
              <label key={diet} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="checkbox"
                  checked={selectedDiets.includes(diet)}
                  onChange={() => handleToggle(diet, selectedDiets, setSelectedDiets)}
                />
                {diet}
              </label>
            ))}
          </div>
        </div>

        {/* Intolerances Checkboxes */}
        <div>
          <h3>Select Intolerances:</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {intolerances.map((intol) => (
              <label key={intol} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="checkbox"
                  checked={selectedIntolerances.includes(intol)}
                  onChange={() => handleToggle(intol, selectedIntolerances, setSelectedIntolerances)}
                />
                {intol}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1e90ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p style={{ textAlign: "center" }}>No recipes found.</p>
        ) : (
          results.map((recipe) => (
            <div
              key={recipe.id}
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
                onClick={() => navigate(`/recipes/${recipe.id}`)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
