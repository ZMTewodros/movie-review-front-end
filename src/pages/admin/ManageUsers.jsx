import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, ShieldCheck, User as UserIcon, ArrowDownToLine } from "lucide-react";

const SUPER_ADMIN_EMAIL = "tewodrosayalew111@gmail.com";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;
  
  const currentEmail = currentUser?.email?.toLowerCase().trim() || "";
  const isSuperAdmin = currentEmail === SUPER_ADMIN_EMAIL.toLowerCase().trim();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      alert("Error loading user list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id) => {
    if (!window.confirm("Promote this user to Admin?")) return;
    try {
      await api.put(`/auth/promote/${id}`);
      fetchUsers(); 
    } catch (err) {
      alert("Promotion failed.");
    }
  };

  const handleDemote = async (id) => {
    if (!window.confirm("Demote this admin to User?")) return;
    try {
      await api.put(`/auth/demote/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Demotion failed.");
    }
  };

  const handleDelete = async (id, email) => {
    if (email.toLowerCase().trim() === SUPER_ADMIN_EMAIL) {
      alert("You cannot delete the super admin!");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/auth/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">User Management</h2>
      
        <div className="text-sm text-gray-400">
          Total Users: {users.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">User</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Email</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Role</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const targetRole = u.Role?.name?.toLowerCase() || "";
                const targetEmail = u.email?.toLowerCase().trim() || "";
                const isTargetSuper = targetEmail === SUPER_ADMIN_EMAIL.toLowerCase().trim();

                return (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        isTargetSuper ? 'bg-purple-100 text-purple-700' : 
                        targetRole === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isTargetSuper ? "SUPER ADMIN" : targetRole}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-4">
                        {isSuperAdmin && targetRole === "user" && (
                          <button onClick={() => handlePromote(u.id)} className="text-green-600">
                            <ShieldCheck size={20} title="Promote" />
                          </button>
                        )}
                        {isSuperAdmin && targetRole === "admin" && !isTargetSuper && (
                          <button onClick={() => handleDemote(u.id)} className="text-yellow-600">
                            <ArrowDownToLine size={20} title="Demote" />
                          </button>
                        )}
                        {!isTargetSuper && (
                          <button onClick={() => handleDelete(u.id, u.email)} className="text-red-500">
                            <Trash2 size={20} title="Delete" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;