// src/api/spoonacular.js
import axios from "axios";

const spoonacular = axios.create({
  baseURL: import.meta.env.VITE_SPOONACULAR_BASE || "https://api.spoonacular.com",
  // DON'T put apiKey here as a header — Spoonacular requires it as a query param.
});

// helper to call endpoints with the apiKey automatically
const withKey = (config = {}) => {
  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  return {
    ...config,
    params: {
      ...(config.params || {}),
      apiKey
    }
  };
};

export const searchRecipes = (query, params = {}) =>
  spoonacular.get("/recipes/complexSearch", withKey({ params: { query, ...params } }));

export const getRecipeInformation = (id, params = {}) =>
  spoonacular.get(`/recipes/${id}/information`, withKey({ params }));

export default spoonacular;
