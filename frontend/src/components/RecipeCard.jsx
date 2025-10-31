import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div
      className="recipe-card"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <img src={recipe.image} alt={recipe.title} />
      <h4>{recipe.title}</h4>
    </div>
  );
};

export default RecipeCard;
