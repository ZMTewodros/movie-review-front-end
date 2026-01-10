import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ReviewCard from "../components/ReviewCard";
import { useAuth } from "../context/AuthContext";

function MovieDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Ensure your backend is sending the Review.User object in this response
    api.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/reviews", { ...review, movie_id: id });
      setReview({ rating: 5, comment: "" });
      setRefresh((r) => !r);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to submit review");
    }
  };

  if (!movie) return <div className="p-8 text-center">Loading movie details...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Movie Info Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full md:w-64 h-96 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-semibold text-gray-800">Director:</span> {movie.director}</p>
            <p><span className="font-semibold text-gray-800">Author:</span> {movie.author}</p>
            <p>
              <span className="font-semibold text-gray-800">Category:</span>{" "}
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                {movie.MovieCategory?.category}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section Header */}
      <div className="border-b border-gray-200 mb-6 pb-2 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Reviews</h2>
        <span className="text-gray-500 text-sm">{movie.Reviews?.length || 0} Reviews</span>
      </div>

      {/* List of Review Cards */}
      <div className="space-y-4">
        {movie.Reviews?.length ? (
          movie.Reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onUpdated={() => setRefresh((r) => !r)}
            />
          ))
        ) : (
          <p className="text-gray-500 italic py-4">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>

      {/* Add Review Form */}
      {token && (
        <form onSubmit={handleSubmit} className="bg-white border border-blue-100 p-6 mt-10 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-800 border-l-4 border-blue-600 pl-3">
            Add Your Review
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
              className="w-24 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} Stars</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="What did you think of the movie?"
              required
            />
          </div>

          {error && <div className="text-red-600 mb-4 text-sm font-medium">⚠️ {error}</div>}

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors">
            Post Review
          </button>
        </form>
      )}
    </div>
  );
}

export default MovieDetails;