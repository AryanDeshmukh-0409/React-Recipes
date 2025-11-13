import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [favoritesCount, setFavoritesCount] = useState(0);
const [mealPlansCount, setMealPlansCount] = useState(0);
const [mostReviewedRecipe, setMostReviewedRecipe] = useState("");
const [highestRatedRecipe, setHighestRatedRecipe] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:3000/reviews");
      const data = await res.json();
      setReviews(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
    try {
      const [favoritesRes, mealPlansRes] = await Promise.all([
        fetch("http://localhost:3000/favorites"),
        fetch("http://localhost:3000/mealPlans"),
      ]);

      const favoritesData = await favoritesRes.json();
      const mealPlansData = await mealPlansRes.json();
      //Count how many favorite recipes exist in the database, and store that number in the component’s state variable favoritesCount
      setFavoritesCount(favoritesData.length);
      //Count how many meal plans have been saved by all users, and store that total in the mealPlansCount state
      setMealPlansCount(mealPlansData.length);

      // Most reviewed recipe
      const reviewCounts = {};
      reviews.forEach((r) => {
        reviewCounts[r.recipeId] = (reviewCounts[r.recipeId] || 0) + 1;
      });
      const mostReviewed = Object.entries(reviewCounts).sort((a, b) => b[1] - a[1])[0];
      setMostReviewedRecipe(mostReviewed ? mostReviewed[0] : "N/A");

      // Highest rated recipe
      const ratings = {};
      reviews.forEach((r) => {
        if (!ratings[r.recipeId]) ratings[r.recipeId] = [];
        ratings[r.recipeId].push(r.rating);
      });
      const avgRatings = Object.entries(ratings).map(([id, vals]) => [id, vals.reduce((a,b)=>a+b,0)/vals.length]);
      const highestRated = avgRatings.sort((a,b)=>b[1]-a[1])[0];
      setHighestRatedRecipe(highestRated ? highestRated[0] : "N/A");
    } catch (err) {
      console.error(err);
    }
  };

  fetchAnalytics();
    fetchUsers();
    fetchReviews();
  }, []);

  // Delete user and associated data
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const deleteEndpoints = ["favorites", "mealPlans", "reviews"];
      for (const endpoint of deleteEndpoints) {
        const res = await fetch(`http://localhost:3000/${endpoint}?userId=${userId}`);
        const items = await res.json();
        for (const item of items) {
          await fetch(`http://localhost:3000/${endpoint}/${item.id}`, { method: "DELETE" });
        }
      }
      await fetch(`http://localhost:3000/users/${userId}`, { method: "DELETE" });
      alert("User deleted successfully");
      fetchUsers();
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Admin Role
  const handleToggleAdmin = async (user) => {
    try {
      const updatedUser = { ...user, isAdmin: !user.isAdmin };
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: updatedUser.isAdmin }),
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await fetch(`http://localhost:3000/reviews/${reviewId}`, { method: "DELETE" });
      alert("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingUsers || loadingReviews) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Users Management */}
      <h2>Users Management</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? "Yes" : "No"}</td>
                <td>
                  <button className="admin-btn" onClick={() => handleToggleAdmin(u)}>
                    {u.isAdmin ? "Revoke Admin" : "Make Admin"}
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics Dashboard */}
<h2 style={{ marginTop: "3rem" }}>Analytics Dashboard</h2>
<div className="analytics-cards">
  <div className="card">
    <h3>Total Users</h3>
    <p>{users.length}</p>
  </div>
  <div className="card">
    <h3>Total Favorite Recipes</h3>
    <p>{favoritesCount}</p>
  </div>
  <div className="card">
    <h3>Total Meal Plans</h3>
    <p>{mealPlansCount}</p>
  </div>
  <div className="card">
    <h3>Most Reviewed Recipe</h3>
    <p>{mostReviewedRecipe}</p>
  </div>
  <div className="card">
    <h3>Highest Rated Recipe</h3>
    <p>{highestRatedRecipe}</p>
  </div>
</div>


      {/* Reviews Management */}
      <h2 style={{ marginTop: "3rem" }}>Reviews Management</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Recipe ID</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((rev) => (
              <tr key={rev.id}>
                
                <td>{rev.recipeId} {rev.recipeName}</td>
                <td>{rev.userId}</td>
                <td>{rev.rating}</td>
                <td>{rev.comment}</td>
                <td>{new Date(rev.date).toLocaleDateString()}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteReview(rev.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
      .analytics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  text-align: center;
}

.card h3 {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

        .admin-dashboard {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial;
        }

        .admin-dashboard h1 {
          text-align: center;
          font-size: 2rem;
          color: #1e1e1e;
          margin-bottom: 2rem;
        }

        h2 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 700px;
        }

        th, td {
          text-align: left;
          padding: 12px 15px;
        }

        thead {
          background-color: #f3f4f6;
          color: #1e293b;
          font-weight: 600;
        }

        tbody tr {
          background: #ffffff;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        tbody tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        tbody tr td {
          border-bottom: 1px solid #e5e7eb;
        }

        .admin-btn, .delete-btn {
          padding: 6px 12px;
          margin-right: 6px;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-btn {
          background: linear-gradient(90deg, #6d28d9, #9333ea);
          color: #fff;
        }

        .admin-btn:hover {
          background: linear-gradient(90deg, #5b21b6, #7e22ce);
        }

        .delete-btn {
          background: #ef4444;
          color: #fff;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        @media (max-width: 640px) {
          th, td {
            padding: 10px;
          }
          .admin-btn, .delete-btn {
            padding: 5px 10px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
