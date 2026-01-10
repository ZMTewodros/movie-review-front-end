import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Edit, Eye } from "lucide-react";

function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", director: "", year: "", image: "", category_id: 1 });

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (err) {
      console.error("Frontend fetch failed:", err);
      setMovies([]); 
    }
  };

  const handleShowReviews = async (movie) => {
    try {
      const res = await api.get(`/reviews/movie/${movie.id}`);
      setSelectedReviews(res.data);
      setShowReviewModal(true);
    } catch (err) {
      alert("Failed to fetch reviews");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies(movies.filter((m) => m.id !== id));
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
    // Centering the entire page content and adding bottom padding
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-24 pt-8 px-4">
      
      {/* Container to constrain width for a centered "Management" look */}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Movie
          </button>
        </div>

        {/* MOVIE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 relative group hover:shadow-xl transition-all duration-300">
              
              <div className="relative overflow-hidden rounded-xl mb-4 shadow-inner">
                <img 
                  src={m.image} 
                  alt={m.title} 
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 border border-white z-10">
                  <span className="text-yellow-500 text-xs">⭐</span>
                  <span className="font-bold text-sm text-gray-800">
                    {m.avgRating ? parseFloat(m.avgRating).toFixed(1) : "0.0"}
                  </span>
                </div>
              </div>

              <div className="font-bold text-xl text-gray-900 leading-tight mb-1">{m.title}</div>
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                 {m.MovieCategory?.category || "Drama"} • {m.year || "N/A"}
              </div>
              
              <button 
                onClick={() => handleShowReviews(m)}
                className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors mb-4"
              >
                <Eye size={16} /> Show {m.reviewCount || 0} User Reviews
              </button>

              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => handleOpenEdit(m)} 
                  className="flex-1 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 flex justify-center text-gray-600 hover:text-blue-600 transition-all"
                  title="Edit Movie"
                >
                  <Edit size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(m.id)} 
                  className="flex-1 py-2.5 border border-gray-100 rounded-xl hover:bg-red-50 flex justify-center text-gray-400 hover:text-red-600 transition-all"
                  title="Delete Movie"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {movies.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">No movies found in the library.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-gray-900">{isEditing ? "Edit Movie Details" : "Register New Movie"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Title</label>
                <input placeholder="Enter title" value={form.title} className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Author</label>
                  <input placeholder="Author" value={form.author} className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, author: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Director</label>
                  <input placeholder="Director" value={form.director} className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, director: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Year</label>
                  <input placeholder="Year" type="number" value={form.year} className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, year: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category</label>
                  <select className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                    <option value="1">Drama</option>
                    <option value="2">Comedy</option>
                    <option value="3">Historical</option>
                    <option value="4">Romance</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cover Image URL</label>
                <input placeholder="http://..." value={form.image} className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setForm({...form, image: e.target.value})} />
              </div>
              
              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  {isEditing ? "Save Changes" : "Add to Library"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Display Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900">User Reviews</h3>
                <p className="text-gray-400 text-sm italic">What people are saying</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="bg-gray-50 hover:bg-gray-100 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {selectedReviews.length > 0 ? (
                <div className="space-y-6">
                  {selectedReviews.map((rev) => (
                    <div key={rev.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                             {rev.User?.name?.charAt(0) || "A"}
                           </div>
                           <span className="font-bold text-sm text-gray-800">{rev.User?.name || "Anonymous"}</span>
                        </div>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg text-xs font-black">⭐ {rev.rating}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                   <p className="text-gray-400 font-medium italic">No reviews yet for this movie.</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowReviewModal(false)} 
              className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
            >
              Back to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMovies;