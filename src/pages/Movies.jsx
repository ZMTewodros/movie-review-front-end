import React, { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { Search, Film, ChevronLeft, ChevronRight, Filter, RefreshCcw } from "lucide-react";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. FETCH MOVIES: Triggered by page changes or category selection
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies`, {
          params: {
            page: currentPage,
            limit: 4, // Updated limit to 4 as requested
            category_id: selectedCategory || undefined
          }
        });
        // rows contain the movie array from the backend response
        setMovies(res.data.movies || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Movie Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [currentPage, selectedCategory]);

  // 2. FETCH CATEGORIES: Fills the dropdown once on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Category Fetch Error:", err);
      }
    };
    fetchCategories();
  }, []);

  // 3. FRONTEND SEARCH FILTER: Filters the current fetched page by title/director
  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.director?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. RESET HANDLER: Clears all filters and returns to page 1
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header & Filter Section */}
      <div className="bg-white border-b py-10 px-4 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Film className="text-blue-600" /> Explore Movies
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title or director..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-gray-700 cursor-pointer shadow-sm"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1); // Reset to first page on new filter
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.category}</option>
                ))}
              </select>
            </div>
            
            {/* Reset Button */}
            {(searchTerm || selectedCategory) && (
              <button 
                onClick={handleReset}
                className="p-3.5 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors text-blue-600 flex items-center gap-2 font-bold"
              >
                <RefreshCcw size={18} />
                <span className="text-xs">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Movie Grid Section */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse text-lg">
            Updating movie list...
          </div>
        ) : (
          <>
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
                {/* Updated grid to 4 columns (lg:grid-cols-4) to match your new limit */}
                {filteredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-xl font-bold text-gray-800">No movies found.</p>
                <button 
                   onClick={handleReset}
                   className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 border rounded-xl disabled:opacity-30 bg-white hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-semibold"
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md">
                    {currentPage}
                  </span>
                  <span className="text-gray-500 font-medium">of {totalPages}</span>
                </div>

                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 border rounded-xl disabled:opacity-30 bg-white hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 font-semibold"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;