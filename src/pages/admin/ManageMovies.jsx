import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { 
  Trash2, Edit, Eye, ChevronDown, 
  ChevronsLeft, ChevronsRight, X, MessageSquare 
} from "lucide-react";

function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4; 

  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [form, setForm] = useState({ 
    title: "", 
    author: "", 
    director: "", 
    year: "", 
    image: "", 
    category_id: "" 
  });

  useEffect(() => { 
    fetchMovies(); 
    fetchCategories();
  }, [currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies", {
        params: { page: currentPage, limit: limit }
      });
      setMovies(res.data.movies || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Categories failed");
    }
  };

  const handleJump = (direction) => {
    let newPage = direction === "forward" ? currentPage + 5 : currentPage - 5;
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setCurrentPage(newPage);
  };

  const handleShowReviews = async (movie) => {
    try {
      const res = await api.get(`/reviews/movie/${movie.id}`);
      setSelectedReviews(res.data || []);
      setSelectedMovieTitle(movie.title);
      setShowReviewModal(true);
    } catch (err) {
      alert("Failed to fetch reviews");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await api.delete(`/movies/${id}`);
      fetchMovies();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleOpenEdit = (movie) => {
    setIsEditing(true);
    setSelectedId(movie.id);
    setForm({ 
      title: movie.title, 
      author: movie.author || "", 
      director: movie.director || "", 
      year: movie.year || "", 
      image: movie.image || "", 
      category_id: movie.category_id 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      year: form.year ? parseInt(form.year, 10) : null,
      category_id: parseInt(form.category_id, 10)
    };

    try {
      if (isEditing) {
        await api.put(`/movies/${selectedId}`, payload);
      } else {
        await api.post("/movies", payload);
      }
      setShowModal(false);
      fetchMovies();
    } catch (err) { 
      alert("Error: " + (err.response?.data?.error || "Check fields")); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-24 pt-8 px-4">
      <div className="w-full max-w-6xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Movie Management</h2>
            <p className="text-gray-500 text-sm">Manage library and view reviews</p>
          </div>
          <button 
            onClick={() => { 
              setIsEditing(false); 
              setForm({ title: "", author: "", director: "", year: "", image: "", category_id: categories[0]?.id || "" }); 
              setShowModal(true); 
            }} 
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
          >
            + Add New Movie
          </button>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex flex-col hover:shadow-md transition-all">
                  <div className="relative overflow-hidden rounded-xl mb-3 h-48 bg-gray-100">
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                      <span className="text-yellow-500 text-[10px]">⭐</span>
                      <span className="font-bold text-xs text-gray-800">
                        {m.avgRating ? parseFloat(m.avgRating).toFixed(1) : "0.0"}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 truncate">{m.title}</h3>
                  <div className="text-gray-400 text-[10px] font-bold uppercase mb-4">
                     {m.MovieCategory?.category || "Uncategorized"} • {m.year || "N/A"}
                  </div>
                  
                  <button onClick={() => handleShowReviews(m)} className="w-full bg-blue-50 text-blue-600 py-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-blue-100 mb-4 mt-auto">
                    <Eye size={14} /> 
                    Show {m.reviewCount || m.Reviews?.length || 0} User Reviews
                  </button>

                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => handleOpenEdit(m)} className="flex-1 py-2 border border-gray-100 rounded-lg hover:bg-gray-50 flex justify-center text-gray-400 hover:text-blue-500 transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(m.id)} className="flex-1 py-2 border border-gray-100 rounded-lg hover:bg-red-50 flex justify-center text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
               <div className="mt-16 flex flex-col items-center gap-4">
               <div className="flex justify-center items-center gap-3">
                 <button disabled={currentPage <= 1} onClick={() => handleJump("backward")} className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 disabled:opacity-30"><ChevronsLeft size={20} /></button>
                 <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-5 py-2.5 bg-[#26C6B9] text-white rounded-lg font-bold disabled:opacity-40">Prev</button>
                 
                 <div className="relative">
                   <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="appearance-none bg-white border border-gray-200 px-4 py-2.5 pr-10 rounded-lg font-bold text-gray-700 outline-none">
                     {[...Array(totalPages)].map((_, i) => (
                       <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                     ))}
                   </select>
                   <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                 </div>

                 <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-5 py-2.5 bg-[#26C6B9] text-white rounded-lg font-bold disabled:opacity-40">Next</button>
                 <button disabled={currentPage >= totalPages} onClick={() => handleJump("forward")} className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 disabled:opacity-30"><ChevronsRight size={20} /></button>
               </div>
             </div>
            )}
          </>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-gray-900">{isEditing ? "Edit Movie" : "Add Movie"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Movie Title" value={form.title} className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({...form, title: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Director" value={form.director} className="w-full border border-gray-200 p-3 rounded-xl outline-none" onChange={e => setForm({...form, director: e.target.value})} />
                <input placeholder="Year" type="number" value={form.year} className="w-full border border-gray-200 p-3 rounded-xl outline-none" onChange={e => setForm({...form, year: e.target.value})} />
              </div>

              <input placeholder="Poster Image URL" value={form.image} className="w-full border border-gray-200 p-3 rounded-xl outline-none" onChange={e => setForm({...form, image: e.target.value})} />
              
              <div className="relative">
                <select 
                  value={form.category_id} 
                  onChange={e => setForm({...form, category_id: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Save Movie</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REVIEW VIEW MODAL (FIXED TO SHOW NAMES) --- */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-black text-gray-900">User Reviews</h3>
                <p className="text-sm text-blue-600 font-bold">{selectedMovieTitle}</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedReviews.length > 0 ? (
                selectedReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* PROFILE ICON WITH INITIAL */}
                        <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                          {rev.User?.name ? rev.User.name.charAt(0) : "U"}
                        </div>
                        {/* USER NAME DISPLAY */}
                        <span className="font-bold text-gray-800 text-sm">
                          {rev.User?.name || "Anonymous User"}
                        </span>
                      </div>
                      <div className="bg-yellow-100 px-2 py-0.5 rounded text-yellow-700 font-bold text-xs flex items-center gap-1">
                        ⭐ {rev.rating}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic ml-9">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <MessageSquare size={48} className="mb-2 opacity-20" />
                  <p className="font-bold">No reviews found in database.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 rounded-b-3xl flex justify-end">
              <button onClick={() => setShowReviewModal(false)} className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMovies;