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

  const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

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
        // API call for each day
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
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>📅 Weekly Meal Planner</h1>

      <div style={{ maxWidth: "400px", margin: "0 auto 2rem" }}>
        <label>
          Target Calories:
          <input
            type="number"
            name="targetCalories"
            value={criteria.targetCalories}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px", marginBottom: "10px" }}
          />
        </label>

        <label>
          Diet (optional):
          <select
            name="diet"
            value={criteria.diet}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px", marginBottom: "10px" }}
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
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {plan && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ textAlign: "center" }}>Your 7-Day Plan</h2>
          {days.map((day) => (
            <div
              key={day}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ textTransform: "capitalize" }}>{day}</h3>
              {plan[day].meals?.map((meal) => (
                <div key={meal.id} style={{ marginBottom: "8px" }}>
                  <a
                    href={`/recipes/${meal.id}`}
                    style={{ color: "#1e90ff", textDecoration: "underline" }}
                  >
                    {meal.title}
                  </a>
                </div>
              ))}
              <p>
                <strong>Total Calories:</strong> {plan[day].nutrients?.calories || "N/A"}
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
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "block",
                margin: "0 auto",
              }}
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
