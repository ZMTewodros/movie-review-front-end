import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Film, LogOut, UserPlus } from "lucide-react";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  const SUPER_ADMIN_EMAIL = "tewodrosayalew111@gmail.com";
  const isSuperAdmin = currentUser?.email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL;

  // Navigation Links
  const navLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/users", label: "Manage Users", icon: <Users size={20} /> },
    { to: "/admin/movies", label: "Manage Movies", icon: <Film size={20} /> },
  ];

  // Only Super Admin sees Add Admin (optional)
  // if (isSuperAdmin) {
  //   navLinks.push({ to: "/admin/add-admin", label: "Add Admin", icon: <UserPlus size={20} /> });
  // }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 text-center border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-widest uppercase text-blue-400">
            {isSuperAdmin ? "Super Admin" : "CineAdmin"}
          </h1>
        </div>

        <nav className="flex-1 mt-6">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
                    location.pathname === link.to 
                      ? "bg-blue-600 text-white shadow-lg border-l-4 border-white" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span className="text-sm font-medium uppercase tracking-wider">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* LOGOUT BUTTON ONLY HERE */}
        {/* <div className="p-4 border-t border-slate-800 mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} /> LOGOUT
          </button>
        </div> */}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Empty header: no logout */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
          <div></div> 
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;