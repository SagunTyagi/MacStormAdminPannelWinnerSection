import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  LayoutDashboard,
  Settings,
  User,
  Vote,
  Users as UsersIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Users",
    icon: User,
    submenuKey: "users",
    subItems: [
      { label: "All Users", path: "/users" },
    ],
  },
  {
    label: "Teams",
    icon: UsersIcon,
    submenuKey: "teams",
    subItems: [
      { label: "All Teams", path: "/teams" },
    ],
  },
  {
    
    label: "Voting Centre",
    icon: Vote,
    submenuKey: "voting",
    subItems: [
      { label: "All Votes", path: "/voting-centre" },
    ],
  },
  {
    label: "Games",
    icon: Gamepad2,
    submenuKey: "games",
    subItems: [
      { label: "All Games", path: "/games" },
      { label: "Matches", path: "/matches" },
    ],
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-64 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white border-r dark:border-zinc-700 min-h-screen">
      <div className="p-4 text-2xl font-bold">MyApp</div>
      <nav className="px-4 space-y-3 my-2 text-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSubmenuOpen = openMenus[item.submenuKey];

          return item.subItems ? (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.submenuKey)}
                className="flex w-full items-center justify-between p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 border-b dark:border-zinc-700 "
              >
                <span className="flex items-center space-x-2">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </span>
                {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {isSubmenuOpen && (
                <div className="ml-5 my-2 space-y-1">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.path}
                      className={`block p-3 rounded hover:text-primary-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${
                        location.pathname === sub.path
                          ? "text-primary-600 font-medium p-3 bg-zinc-300 dark:bg-zinc-700"
                          : ""
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 ${
                location.pathname === item.path
                  ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                  : ""
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
