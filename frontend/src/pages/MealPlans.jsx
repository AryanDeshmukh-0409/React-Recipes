import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MealPlans = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) return;
    const fetchMealPlans = async () => {
      try {
        const res = await fetch(`http://localhost:3000/mealPlans?userId=${loggedInUser.id}`);
        const data = await res.json();
        setMealPlans(data);
      } catch (err) {
        console.error("Error fetching meal plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlans();
  }, [loggedInUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal plan?")) return;
    try {
      await fetch(`http://localhost:3000/mealPlans/${id}`, { method: "DELETE" });
      setMealPlans(mealPlans.filter((plan) => plan.id !== id));
      alert("Meal plan deleted!");
    } catch (err) {
      console.error("Error deleting meal plan:", err);
    }
  };

  const handleLoad = (plan) => {
    localStorage.setItem("currentMealPlan", JSON.stringify(plan));
    navigate("/mealplanner"); // redirect to Meal Planner page
  };

  if (loading) return <p>Loading your meal plans...</p>;
  if (!mealPlans.length) return <p>You have no saved meal plans.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem", fontWeight: "600" }}>
        Saved Meal Plans
      </h2>

      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {mealPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <h3 style={{ margin: "0", fontSize: "1.3rem", fontWeight: "600", color: "#333" }}>
              {plan.name}
            </h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Week starting: {plan.week}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {plan.planData &&
                Object.keys(plan.planData).map((day) => {
                  const dayData = plan.planData[day];
                  return (
                    <div key={day}>
                      <h4
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "500",
                          marginBottom: "0.5rem",
                          color: "#555",
                        }}
                      >
                        {day}
                      </h4>
                      {dayData.meals && dayData.meals.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: "0", margin: "0", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {dayData.meals.map((meal) => (
                            <li
                              key={meal.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                backgroundColor: "#f9f9f9",
                                padding: "0.5rem",
                                borderRadius: "8px",
                                width: "120px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                textAlign: "center",
                                transition: "transform 0.2s",
                              }}
                            >
                              <img
                                src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`}
                                alt={meal.title}
                                style={{
                                  width: "100px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  marginBottom: "5px",
                                }}
                              />
                              <a
                                href={`/recipes/${meal.id}`}
                                style={{ textDecoration: "none", color: "#1e90ff", fontSize: "0.85rem", fontWeight: "500" }}
                              >
                                {meal.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "0.85rem", color: "#999" }}>No meals planned.</p>
                      )}
                    </div>
                  );
                })}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                onClick={() => handleLoad(plan)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  backgroundColor: "#1e90ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
              >
                Load Plan
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  backgroundColor: "#ff4757",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlans;

