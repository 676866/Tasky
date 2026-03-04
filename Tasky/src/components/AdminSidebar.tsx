// src/components/AdminSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { Briefcase, Users, Bell, Home, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); 
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-6">
      <div className="text-2xl font-bold tracking-wide text-center mb-6">Tasky Admin</div>

      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md transition ${
              isActive ? "bg-blue-600" : "hover:bg-gray-700"
            }`
          }
        >
          <Home size={20} /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md transition ${
              isActive ? "bg-blue-600" : "hover:bg-gray-700"
            }`
          }
        >
          <Briefcase size={20} /> Projects
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md transition ${
              isActive ? "bg-blue-600" : "hover:bg-gray-700"
            }`
          }
        >
          <Users size={20} /> Team Members
        </NavLink>

        <NavLink
          to="/admin/reminders"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md transition ${
              isActive ? "bg-blue-600" : "hover:bg-gray-700"
            }`
          }
        >
          <Bell size={20} /> Reminders
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center justify-center gap-2 p-2 bg-red-600 rounded-md hover:bg-red-700 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
