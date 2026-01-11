import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await api.post("/auth/login", form);
    // res.data contains { token, user } based on your backend controller
    const { token, user } = res.data;

    // Pass the token to login (and update AuthContext to save user)
    login(token); 

    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/movies");
    }
  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            required
            name="email"
            type="email"
            placeholder="ienetworks@gmail.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            required
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded">
            {error}
          </div>
        )}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-bold shadow hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Login"}
        </button>

        {showRegister && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-2">Don't have an account?</p>
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-lg w-full font-bold hover:bg-green-700 transition"
              onClick={() => navigate("/register")}
            >
              Create New Account
            </button>
          </div> 
        )}
      </form>
    </div>
  );
}

export default Login;