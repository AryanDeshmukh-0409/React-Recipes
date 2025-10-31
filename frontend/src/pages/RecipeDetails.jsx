import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading recipe details...</p>;

  return (
    <div className="page-container">
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} width="300" />
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients?.map((i) => (
          <li key={i.id}>{i.original}</li>
        ))}
      </ul>

      <h3>Instructions:</h3>
      <p dangerouslySetInnerHTML={{ __html: recipe.instructions }}></p>

      <h3>Nutrition Summary:</h3>
      <p>Calories: {recipe.nutrition?.nutrients?.[0]?.amount ?? "N/A"}</p>

      <p className="register-prompt">
        ❤️ Want to save favorites and meal plans?{" "}
        <a href="/">Create an account</a> or <a href="/">Login</a>!
      </p>
    </div>
  );
};

export default RecipeDetails;
