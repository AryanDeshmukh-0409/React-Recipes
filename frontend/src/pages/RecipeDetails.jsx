import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
        );
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe details...</p>;
  if (!recipe) return <p>Recipe not found!</p>;

  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipe.title}</h1>

      <div className="recipe-header">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />

        <div className="recipe-info">
          <h3>Ready in {recipe.readyInMinutes} minutes</h3>
          <h3>Servings: {recipe.servings}</h3>
          <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
        </div>
      </div>

      <div className="recipe-section">
        <h2>Ingredients 🧂</h2>
        <ul className="ingredient-list">
          {recipe.extendedIngredients?.map((ing) => (
            <li key={ing.id}>{ing.original}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h2>Instructions 👩‍🍳</h2>
        {recipe.analyzedInstructions?.length > 0 ? (
          <ol className="instruction-list">
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        ) : (
          <p>No instructions provided.</p>
        )}
      </div>

      {recipe.nutrition && (
        <div className="recipe-section">
          <h2>Nutrition Facts 🥗</h2>
          <ul className="nutrition-list">
            {recipe.nutrition.nutrients.slice(0, 5).map((n) => (
              <li key={n.name}>
                {n.name}: {Math.round(n.amount)} {n.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
