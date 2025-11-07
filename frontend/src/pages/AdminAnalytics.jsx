// src/App.jsx or src/routes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminAnalytics from "./pages/AdminAnalytics";
import Login from "./pages/Login";
import GuestHome from "./pages/GuestHome";
import UserHome from "./pages/UserHome";

function App() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const AdminRoute = ({ children }) => {
    return loggedInUser?.isAdmin ? children : <Navigate to="/guest/home" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/guest/home" element={<GuestHome />} />
        <Route path="/user/home" element={<UserHome />} />
        
        {/* Admin-only route */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
