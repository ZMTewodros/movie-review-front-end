import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Edit, Eye } from "lucide-react";

function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4; // Matches your UI grid layout

  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", director: "", year: "", image: "", category_id: 1 });

  useEffect(() => { 
    fetchMovies(); 
  }, [currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies", {
        params: { page: currentPage, limit: limit }
      });
      // Handle both paginated object and simple array
      setMovies(res.data.movies || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch failed:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowReviews = async (movie) => {
    try {
      const res = await api.get(`/reviews/movie/${movie.id}`);
      setSelectedReviews(res.data || []);
      setShowReviewModal(true);
    } catch (err) {
      alert("Failed to fetch reviews");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
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
      setForm({ title: "", author: "", director: "", year: "", image: "", category_id: 1 });
      fetchMovies();
    } catch (err) { 
      alert("Action failed: " + (err.response?.data?.error || "Unknown error")); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-24 pt-8 px-4">
      <div className="w-full max-w-6xl">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Movie Management</h2>
            <p className="text-gray-500 text-sm">Create, edit, and track movie reviews</p>
          </div>
          <button 
            onClick={() => { 
              setIsEditing(false); 
              setForm({ title: "", author: "", director: "", year: "", image: "", category_id: 1 }); 
              setShowModal(true); 
            }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            + Add New Movie
          </button>
        </div>

        {/* MOVIE GRID */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold italic">Loading Library...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(movies) && movies.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-xl mb-4 shadow-inner">
                    <img src={m.image} alt={m.title} className="w-full h-52 object-cover" />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-white">
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <span className="font-bold text-sm text-gray-800">{m.avgRating || "0.0"}</span>
                    </div>
                  </div>

                  <div className="font-bold text-xl text-gray-900 leading-tight mb-1">{m.title}</div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                     {m.MovieCategory?.category || "Movie"} • {m.year || "2025"}
                  </div>
                  
                  <button onClick={() => handleShowReviews(m)} className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors mb-4">
                    <Eye size={16} /> Show {m.reviewCount || 0} User Reviews
                  </button>

                  <div className="flex gap-3 pt-4 border-t border-gray-50">
                    <button onClick={() => handleOpenEdit(m)} className="flex-1 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 flex justify-center text-gray-400 hover:text-blue-600"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(m.id)} className="flex-1 py-2.5 border border-gray-100 rounded-xl hover:bg-red-50 flex justify-center text-gray-400 hover:text-red-600"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION (As seen in your actual project screenshots) --- */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-3">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 font-semibold disabled:opacity-50 hover:bg-gray-50 transition-all"
                >
                  ‹ Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-11 h-11 rounded-xl font-bold transition-all ${
                        currentPage === i + 1 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-white text-gray-500 border border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-2.5 bg-white border border-gray-900 rounded-xl text-gray-900 font-bold hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  Next <span className="font-normal text-lg">›</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-gray-900">{isEditing ? "Edit Movie" : "Add Movie"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" value={form.title} className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({...form, title: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Author" value={form.author} className="w-full border-gray-200 border p-3 rounded-xl outline-none" onChange={e => setForm({...form, author: e.target.value})} />
                <input placeholder="Director" value={form.director} className="w-full border-gray-200 border p-3 rounded-xl outline-none" onChange={e => setForm({...form, director: e.target.value})} />
              </div>
              <input placeholder="Year" type="number" value={form.year} className="w-full border-gray-200 border p-3 rounded-xl outline-none" onChange={e => setForm({...form, year: e.target.value})} />
              <input placeholder="Image URL" value={form.image} className="w-full border-gray-200 border p-3 rounded-xl outline-none" onChange={e => setForm({...form, image: e.target.value})} />
              <div className="pt-4 flex flex-col gap-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isEditing ? "Update" : "Create"}</button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full text-gray-400 font-bold py-2">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Reviews</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {selectedReviews.length > 0 ? selectedReviews.map((rev) => (
                <div key={rev.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{rev.User?.name || "User"}</span>
                    <span className="text-yellow-500 text-xs">⭐ {rev.rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{rev.comment}"</p>
                </div>
              )) : <p className="text-center py-10 text-gray-400">No reviews found.</p>}
            </div>
            <button onClick={() => setShowReviewModal(false)} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-bold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMovies;