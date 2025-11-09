import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MealPlanner = () => {
  const [criteria, setCriteria] = useState({
    targetCalories: 2000,
    diet: "",
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  const navigate = useNavigate();

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria({ ...criteria, [name]: value });
  };

  // Generate meal plan
  const generatePlan = async () => {
    if (!criteria.targetCalories) return alert("Enter target calories");
    setLoading(true);

    try {
      const newPlan = {};

      for (let day of days) {
        const res = await fetch(
          `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${criteria.targetCalories}&diet=${criteria.diet}&apiKey=${apiKey}`
        );
        const data = await res.json();
        newPlan[day] = data;
      }

      setPlan(newPlan);
    } catch (err) {
      console.error("Error generating meal plan:", err);
      alert("Failed to generate meal plan");
    } finally {
      setLoading(false);
    }
  };

  // Save plan to JSON-Server
  const savePlan = async () => {
    if (!loggedInUser) return alert("Login to save meal plan");
    const weekStart = new Date().toISOString().split("T")[0];
    const planToSave = {
      userId: loggedInUser.id,
      name: `Weekly Plan (${weekStart})`,
      week: weekStart,
      planData: plan,
    };

    try {
      const res = await fetch("http://localhost:3000/mealPlans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planToSave),
      });
      if (!res.ok) throw new Error("Failed to save plan");
      alert("Meal plan saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save meal plan");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#333",
          fontSize: "2rem",
        }}
      >
        📅 Weekly Meal Planner
      </h1>

      {/* Criteria Section */}
      <div
        style={{
          maxWidth: "450px",
          margin: "0 auto 2rem",
          background: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <label style={{ fontWeight: "600", color: "#333" }}>
          Target Calories:
          <input
            type="number"
            name="targetCalories"
            value={criteria.targetCalories}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              marginBottom: "16px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </label>

        <label style={{ fontWeight: "600", color: "#333" }}>
          Diet (optional):
          <select
            name="diet"
            value={criteria.diet}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              marginBottom: "16px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            <option value="">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten free">Gluten Free</option>
            <option value="ketogenic">Ketogenic</option>
          </select>
        </label>

        <button
          onClick={generatePlan}
          style={{
            backgroundColor: "#1e90ff",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "600",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1e90ff")}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {/* Meal Plan Section */}
      {plan && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
            Your 7-Day Plan
          </h2>
          {days.map((day) => (
            <div
              key={day}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                background: "white",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  textTransform: "capitalize",
                  color: "#1e90ff",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "8px",
                  marginBottom: "1rem",
                }}
              >
                {day}
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {plan[day].meals?.map((meal) => (
                  <div
                    key={meal.id}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      background: "#fafafa",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img
                      src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`}
                      alt={meal.title}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderBottom: "1px solid #ddd",
                      }}
                    />
                    <div style={{ padding: "0.8rem" }}>
                      <a
                        href={`/recipes/${meal.id}`}
                        style={{
                          color: "#1e90ff",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        {meal.title}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <p
                style={{
                  marginTop: "1rem",
                  fontWeight: "600",
                  color: "#555",
                }}
              >
                <strong>Total Calories:</strong>{" "}
                {plan[day].nutrients?.calories || "N/A"}
              </p>
            </div>
          ))}

          {loggedInUser && (
            <button
              onClick={savePlan}
              style={{
                backgroundColor: "#ff4757",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "block",
                margin: "2rem auto",
                fontWeight: "600",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#e84118")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4757")}
            >
              Save Plan
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
