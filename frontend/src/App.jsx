import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AccessPage from "./pages/AccessPage";
import Home from "./pages/Home";
import SearchRecipes from "./pages/SearchRecipes";
import RecipeDetails from "./pages/Recipedetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favorites from "./pages/Favorites";
import MealPlanner from "./pages/MealPlanner";

function App() {
  const navigate = useNavigate();

  // Store logged in user in state
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // Navbar visibility: only show after user chooses access
  const [showNavbar, setShowNavbar] = useState(false);

  // Detect if user is logged in
  useEffect(() => {
    if (loggedInUser) setShowNavbar(true);
  }, [loggedInUser]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    setShowNavbar(false);
    navigate("/"); // redirect to AccessPage
  };

  return (
    <>
      {showNavbar && (
        <Navbar loggedInUser={loggedInUser} onLogout={handleLogout} />
      )}

      <div className="content" style={{ minHeight: "100vh", padding: "1rem" }}>
        <Routes>
          <Route
            path="/"
            element={
              <AccessPage
                setShowNavbar={setShowNavbar}
                setLoggedInUser={setLoggedInUser}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setLoggedInUser={setLoggedInUser} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest/home" element={<Home />} />
          <Route path="/guest/search" element={<SearchRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/mealplanner" element={<MealPlanner />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
