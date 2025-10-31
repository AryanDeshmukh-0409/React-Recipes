import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>React Recipes</h1>
      <div>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
        <NavLink to="/mealplanner">Meal Planner</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

