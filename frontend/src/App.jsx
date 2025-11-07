import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AccessPage from "./pages/AccessPage";
import Home from "./pages/Home";
import SearchRecipes from "./pages/SearchRecipes";
import RecipeDetails from "./pages/Recipedetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favorites from "./pages/Favorites";
import CustomRecipes from "./pages/CustomRecipe";
import PublicRecipes from "./pages/PublicRecipe";
import AdvancedSearch from "./pages/AdvanceSearch";
import MealPlanner from "./pages/MealPlanner";
import MealPlans from "./pages/MealPlans";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function (centralized)
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    navigate("/"); // redirect to access page
  };

  // Hide Navbar only on AccessPage
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && (
        <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
      )}

      <div className="content" style={{ minHeight: "100vh", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<AccessPage />} />
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/public-recipes" element={<PublicRecipes />} />
          <Route path="/custom-recipes" element={<CustomRecipes />} />
          <Route path="/guest/home" element={<Home />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/meal-plans" element={<MealPlans />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/guest/search" element={<SearchRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          {/* Existing Spoonacular recipes */}
  <Route path="/recipes/:id" element={<RecipeDetails />} />

  {/* ✅ Custom/Public recipes */}
  <Route path="/recipes/custom/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

