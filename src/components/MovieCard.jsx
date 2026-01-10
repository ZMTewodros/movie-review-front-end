import React from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <img
        src={movie.image}
        alt={movie.title}
        className="h-48 w-full object-cover mb-4 rounded"
      />
      <h2 className="font-bold text-lg mb-1">{movie.title}</h2>
      <p className="mb-1 text-gray-700">Director: {movie.director}</p>
      <p className="mb-1 text-gray-600">Author: {movie.author}</p>
      <p className="mb-2 text-gray-500">Category: {movie.MovieCategory?.category}</p>
      <Link
        to={`/movies/${movie.id}`}
        className="bg-blue-500 text-white px-2 py-1 rounded text-center"
      >
        View Details
      </Link>
    </div>
  );
}

export default MovieCard;