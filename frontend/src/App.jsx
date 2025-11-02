import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AccessPage from "./pages/AccessPage";
import Home from "./pages/Home";
import SearchRecipes from "./pages/SearchRecipes";
import RecipeDetails from "./pages/Recipedetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  // Global logged-in user state
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );

  return (
    <>
      <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

      <div className="content" style={{ minHeight: "100vh", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<AccessPage />} />
          <Route
            path="/login"
            element={<Login setLoggedInUser={setLoggedInUser} />}
          />
          <Route path="/guest/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest/search" element={<SearchRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
