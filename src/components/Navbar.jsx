import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center sticky top-0 z-50">
      <div className="font-bold text-xl">
        <Link to="/">🎬 Movie Review</Link>
      </div>

      <div className="flex gap-4 items-center">
        {/* Only show 'Movies' link to guests or regular users */}
        {(!user || user.role !== "admin") && (
          <Link to="/movies" className="hover:underline">Movies</Link>
        )}

        {!token ? (
          <Link to="/register" className="hover:underline">Register</Link>
        ) : (
          <>
            <span className="text-sm">
              Hello, <b>{user?.name}</b> <span className="text-xs opacity-75">({user?.role})</span>
            </span>

            {/* The 'Admin Dashboard' link has been removed from here 
                as requested, since the sidebar handles navigation */}

            <button 
              onClick={() => { logout(); navigate("/login"); }} 
              className="bg-red-500 px-3 py-1 rounded text-sm font-bold hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;