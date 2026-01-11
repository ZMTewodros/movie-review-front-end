import React, { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { 
  Search, Film, ChevronDown, Filter, 
  RefreshCcw, ChevronsLeft, ChevronsRight 
} from "lucide-react";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. FETCH MOVIES
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies`, {
          params: {
            page: currentPage,
            limit: 4, 
            category_id: selectedCategory || undefined
          }
        });
        setMovies(res.data.movies || []);
        // Rounding up ensures we have the correct page count
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Movie Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedCategory]);

  // 2. FETCH CATEGORIES
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

  // 3. JUMP LOGIC (Button skip)
  const handleJump = (amount) => {
    let newPage = currentPage + amount;
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setCurrentPage(newPage);
  };

  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.director?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

            <div className="relative w-full md:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-gray-700 cursor-pointer shadow-sm"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.category}</option>
                ))}
              </select>
            </div>
            
            {(searchTerm || selectedCategory) && (
              <button onClick={handleReset} className="p-3.5 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors text-blue-600 flex items-center gap-2 font-bold">
                <RefreshCcw size={18} />
                <span className="text-xs">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse text-lg">Updating movie list...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 md:gap-4">
                  
                  {/* Jump Back 5 */}
                  <button 
                    onClick={() => handleJump(-5)}
                    disabled={currentPage <= 1}
                    className="p-3 bg-white border-2 border-gray-100 text-gray-400 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronsLeft size={20} />
                  </button>

                  {/* Prev */}
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-6 py-3 bg-[#26C6B9] text-white rounded-xl font-bold disabled:opacity-40 hover:brightness-95 transition-all shadow-md shadow-teal-100"
                  >
                    Prev
                  </button>

                  {/* --- FIXED INTERVAL DROPDOWN --- */}
                  <div className="relative group">
                    <select 
                      value={currentPage}
                      onChange={(e) => setCurrentPage(Number(e.target.value))}
                      className="appearance-none bg-white border-2 border-gray-100 pl-5 pr-12 py-3 rounded-xl font-bold text-gray-800 outline-none cursor-pointer focus:border-[#26C6B9] transition-all shadow-sm"
                    >
                      {(() => {
                        const options = [];
                        // Start at 1, then jump to 6, 11, 16...
                        for (let i = 1; i <= totalPages; i === 1 ? i += 5 : i += 5) {
                          // This adjustment ensures it lands on 1, 6, 11...
                          const pageNum = i === 6 ? 5 : (i > 1 ? i - 1 : i); 
                          
                          // Simplified Logic: Start at 1, then go 5, 10, 15...
                          let displayNum = i;
                          if (i === 1) {
                             options.push(<option key={1} value={1}>Page 1</option>);
                          } else {
                             options.push(<option key={i} value={i}>Page {i}</option>);
                          }
                        }

                        // Ensure the current page is ALWAYS in the dropdown so it doesn't look blank
                        if (!options.find(opt => opt.props.value === currentPage)) {
                            options.push(<option key={currentPage} value={currentPage}>Page {currentPage}</option>);
                        }

                        // Ensure the last page is always there
                        if (!options.find(opt => opt.props.value === totalPages)) {
                            options.push(<option key={totalPages} value={totalPages}>Page {totalPages}</option>);
                        }

                        return options.sort((a, b) => a.props.value - b.props.value);
                      })()}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-[#26C6B9] transition-colors" />
                  </div>

                  {/* Next */}
                  <button 
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-6 py-3 bg-[#26C6B9] text-white rounded-xl font-bold disabled:opacity-40 hover:brightness-95 transition-all shadow-md shadow-teal-100"
                  >
                    Next
                  </button>

                  {/* Jump Forward 5 */}
                  <button 
                    onClick={() => handleJump(5)}
                    disabled={currentPage >= totalPages}
                    className="p-3 bg-white border-2 border-gray-100 text-gray-400 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronsRight size={20} />
                  </button>
                </div>

                <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                  Showing <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;