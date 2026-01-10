import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    movies: 0, users: 0, reviews: 0, avgRating: 0, recentUsers: [], ratingDist: []
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/stats");
        const { counts, movies, recentUsers } = res.data;

        const totalAvg = movies.length 
          ? (movies.reduce((sum, m) => sum + parseFloat(m.avgRating || 0), 0) / movies.length).toFixed(1)
          : 0;

        const chartData = movies.map(m => ({
          name: m.title.substring(0, 10),
          rating: parseFloat(m.avgRating) || 0
        }));

        setStats({
          movies: counts.movies,
          users: counts.users,
          reviews: counts.reviews,
          avgRating: totalAvg,
          recentUsers: recentUsers,
          ratingDist: chartData
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center"> Movie Management Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Movies" value={stats.movies} icon="🎬" />
        <StatCard label="Total Users" value={stats.users} icon="👤" />
        <StatCard label="Avg Rating" value={stats.avgRating} icon="⭐" />
        <StatCard label="Total Reviews" value={stats.reviews} icon="👁️" />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white rounded shadow p-6">
          <h3 className="font-semibold mb-4">Movie Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ratingDist}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-72 bg-white rounded shadow p-6">
          <h3 className="font-semibold mb-4">Recent Users</h3>
          <ul>
            {stats.recentUsers.map(u => (
              <li key={u.id} className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase">
                  {u.name?.[0]}
                </span>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.Role?.name} &bull; {u.createdAt?.slice(0, 10)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded shadow p-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-bold text-lg">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
}

export default Dashboard;