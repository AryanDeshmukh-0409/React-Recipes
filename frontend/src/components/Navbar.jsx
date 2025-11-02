import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ loggedInUser, setLoggedInUser }) {
  return (
    <nav style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
      <h1 style={{ marginRight: "20px" }}>React Recipes</h1>

      <div style={{ display: "flex", gap: "15px" }}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
        <NavLink to="/mealplanner">Meal Planner</NavLink>
      </div>

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
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#ccc",
            }}
          ></div>

          <span style={{ fontWeight: "600" }}>{loggedInUser.name}</span>

          <button
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              setLoggedInUser(null); // update state dynamically
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
