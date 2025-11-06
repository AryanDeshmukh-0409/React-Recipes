import React, { useEffect, useState } from "react";

const CustomRecipes = () => {
  const [customRecipes, setCustomRecipes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    isPublic: false,
  });
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // ✅ Fetch user's custom recipes
  useEffect(() => {
    const fetchCustomRecipes = async () => {
      try {
        if (!loggedInUser || loggedInUser.name === "Guest") {
          // Guest: load from localStorage
          const localRecipes = JSON.parse(localStorage.getItem("customRecipes")) || [];
          setCustomRecipes(localRecipes);
        } else {
          const res = await fetch(`http://localhost:3000/customRecipes?userId=${loggedInUser.id}`);
          const data = await res.json();
          setCustomRecipes(data);
        }
      } catch (err) {
        console.error("Error fetching custom recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomRecipes();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Add custom recipe
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRecipe = {
      id: Date.now().toString(),
      userId: loggedInUser?.id || "guest",
      title: formData.title,
      ingredients: formData.ingredients,
      instructions: formData.instructions,
      isPublic: formData.isPublic,
      image: "https://placehold.co/312x231/eee/ccc?text=My+Recipe",
    };

    if (!loggedInUser || loggedInUser.name === "Guest") {
      // Guest → save in localStorage
      const localRecipes = JSON.parse(localStorage.getItem("customRecipes")) || [];
      localStorage.setItem("customRecipes", JSON.stringify([...localRecipes, newRecipe]));
      setCustomRecipes([...localRecipes, newRecipe]);
      alert("Recipe added locally! (Guest mode)");
    } else {
      // Logged-in user → save to JSON Server
      try {
        const res = await fetch("http://localhost:3000/customRecipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRecipe),
        });
        if (!res.ok) throw new Error("Failed to save recipe");
        setCustomRecipes([...customRecipes, newRecipe]);
        alert("Recipe added successfully!");
      } catch (err) {
        console.error("Error adding custom recipe:", err);
      }
    }

    setFormData({ title: "", ingredients: "", instructions: "", isPublic: false });
  };

  // ✅ Delete a recipe
  const handleDelete = async (id) => {
    if (!loggedInUser || loggedInUser.name === "Guest") {
      const localRecipes = JSON.parse(localStorage.getItem("customRecipes")) || [];
      const updated = localRecipes.filter((r) => r.id !== id);
      localStorage.setItem("customRecipes", JSON.stringify(updated));
      setCustomRecipes(updated);
      return;
    }

    try {
      await fetch(`http://localhost:3000/customRecipes/${id}`, { method: "DELETE" });
      setCustomRecipes(customRecipes.filter((r) => r.id !== id));
      alert("Recipe deleted!");
    } catch (err) {
      console.error("Error deleting custom recipe:", err);
    }
  };

  if (loading) return <p>Loading your custom recipes...</p>;

  return (
    <div className="page-container" style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>👨‍🍳 Your Custom Recipes</h2>

      {/* Recipe Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
          margin: "0 auto 2rem",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Recipe Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          value={formData.ingredients}
          onChange={handleChange}
          required
          rows="3"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
          rows="4"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
          Make recipe public
        </label>
        <button
          type="submit"
          style={{
            backgroundColor: "#ff4757",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add Recipe
        </button>
      </form>

      {/* Recipe List */}
      {customRecipes.length === 0 ? (
        <p style={{ textAlign: "center" }}>You haven’t added any custom recipes yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {customRecipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                background: "white",
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
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
              <button
                onClick={() => handleDelete(recipe.id)}
                style={{
                  backgroundColor: "#ff4757",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRecipes;
