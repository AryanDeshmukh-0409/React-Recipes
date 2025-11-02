import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  return (
    <nav style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
      <h1 style={{ marginRight: "20px" }}>React Recipes</h1>

      {/* Main navigation links */}
      <div style={{ display: "flex", gap: "15px" }}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
        <NavLink to="/mealplanner">Meal Planner</NavLink>
      </div>

      {/* Logged-in user display */}
      {loggedInUser && (
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "5px 10px",
            borderRadius: "8px",
            backgroundColor: "#f1f1f1",
          }}
        >
          {/* Empty profile picture */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#ccc",
            }}
          ></div>

          {/* User name */}
          <span style={{ fontWeight: "600" }}>{loggedInUser.name}</span>

          {/* Optional Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              window.location.reload();
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              color: "#007bff",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
