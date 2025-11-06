import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ loggedInUser, setLoggedInUser, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <h1 style={{ color: "#007bff", fontSize: "1.5rem" }}>React Recipes</h1>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <NavLink
          to="/guest/home"
          style={({ isActive }) => ({
            color: isActive ? "#007bff" : "#333",
            textDecoration: "none",
            fontWeight: "500",
          })}
        >
          Home
        </NavLink>

        <NavLink
          to="/guest/search"
          style={({ isActive }) => ({
            color: isActive ? "#007bff" : "#333",
            textDecoration: "none",
            fontWeight: "500",
          })}
        >
          Recipes
        </NavLink>

        {/* ✅ Favorites only for logged-in users */}
        {loggedInUser && (
          <NavLink
            to="/favorites"
            style={({ isActive }) => ({
              color: isActive ? "#007bff" : "#333",
              textDecoration: "none",
              fontWeight: "500",
            })}
          >
            Favorites
          </NavLink>
        )}

        <NavLink
          to="/mealplanner"
          style={({ isActive }) => ({
            color: isActive ? "#007bff" : "#333",
            textDecoration: "none",
            fontWeight: "500",
          })}
        >
          Meal Planner
        </NavLink>

        {/* ✅ New Custom Recipes link */}
        <NavLink
          to="/custom-recipes"
          style={({ isActive }) => ({
            color: isActive ? "#007bff" : "#333",
            textDecoration: "none",
            fontWeight: "500",
          })}
        >
          Custom Recipes
        </NavLink>
      </div>
       <NavLink
  to="/public-recipes"
  style={({ isActive }) => ({
    color: isActive ? "#007bff" : "#333",
    textDecoration: "none",
    fontWeight: "500",
  })}
>
  Public Recipes
</NavLink>

      {/* Logged-in user section */}
      {loggedInUser && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#f7f7f7",
            borderRadius: "8px",
            padding: "6px 12px",
          }}
        >
         

          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#d0d0d0",
            }}
          ></div>
          <span style={{ fontWeight: "600", color: "#333" }}>
            {loggedInUser.name}
          </span>
          <button
            onClick={onLogout}
            style={{
              border: "none",
              background: "transparent",
              color: "#007bff",
              fontWeight: "600",
              cursor: "pointer",
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

