import React from "react";
import { Menu, LogOut } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = ({ onToggleSidebar }) => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-zinc-800 border-b dark:border-zinc-700">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </button>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        <span className="text-sm text-zinc-600 dark:text-zinc-300">Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="Avatar"
          className="w-8 h-8 rounded-full border"
        />
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-600"
        >
          <LogOut className="w-5 h-5 text-red-600 dark:text-white" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
