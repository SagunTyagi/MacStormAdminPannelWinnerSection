import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  ImageIcon,
  LayoutDashboard,
  Settings,
  User,
  DollarSign,
  AlertTriangle,
  Bell,
  ClipboardList,
  Headphones,
  Crown,
  Monitor,
  Gift,
  Users as UsersIcon,
  Radio,
  Users,
  Trophy,
  Globe,
  Wallet,
  Coins,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axios";

const menuItems = [
  {
    label: "Super Admin Panel",
    icon: Crown,
    // path: "/super-admin-panel",
    submenuKey: "super-admin",
    subItems: [
      // { label: "P&L Overview", path: "/p&l-overview" },
      { label: "Admin Management", path: "/admin-management" },
      // { label: "System Health", path: "/system-health" },
      // { label: "Audit Log Viewer", path: "/audit-log" },
      // { label: "Manual Ledger", path: "/manual-ledger" },
    ],
  },
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
      { label: "User Settings", path: "/user-settings" },
      {
        label: "User KYC",
        path: "/user-kyc",
        submenuKey: "userKyc",
        subItems: [{ label: "KYC", path: "/kyc" }],
      },
      // { label: "User Teams", path: "/user-teams" },
      { label: "All Withdraw", path: "/all-withdraw" },
    ],
  },
  {
    label: "Teams",
    icon: UsersIcon,
    submenuKey: "teams",
    subItems: [
      { label: "All Teams", path: "/teams" },
      { label: "Add Teams", path: "/add-teams" },
      { label: "Games Registration", path: "/games-registation" },
      { label: "Registration Form Controls", path: "/registation-details" },
      { label: "Prize Distribution", path: "/prize-distribution" },
      { label: "Rules&Regulations", path: "/rules-regulations" },
    ],
  },
  {
    label: "Payment Gateway",
    icon: Wallet,
    path: "/payment-gateway",
    submenuKey: "paymentGateway",
    subItems: [
      { label: "PhonePay Gateway", path: "/phonepay-gateway" },
      { label: "User Wallet Ledger", path: "/user-wallet-ledger" },
    ],
  },
  //   {
  //   label: "Packs",
  //   icon: Trophy,
  //   submenuKey: "packs",
  //   subItems: [
  //     { label: "Diamond Packs", path: "/diamond-packs" },
  //     { label: "Bundles Manage", path: "/budles-manage" },
  //     { label: "Spin Reward Rules", path: "/spin-reward-rules" },
  //     { label: "Exchange Rate", path: "/exchange-rate" },
  //     { label: "User Redemption logs", path: "/user-redemption-logs" },
  //   ],
  // },
  // {
  //   label: "Tournaments",
  //   icon: Trophy,
  //   submenuKey: "tournaments",
  //   subItems: [{ label: "Add Tournaments", path: "/tournaments" }],
  // },
  {
    label: "Images",
    icon: ImageIcon,
    path: "/admin/images",
  },
  {
    label: "Games",
    icon: Gamepad2,
    submenuKey: "games",
    subItems: [{ label: "All Games", path: "/games" }],
  },
  // {
  //   label: "Daily Bets",
  //   icon: DollarSign,
  //   submenuKey: "dailyBets",
  //   subItems: [{ label: "Overview", path: "/admin/bets" }],
  // },
  {
    label: "Website",
    icon: Globe,
    submenuKey: "website",
    subItems: [
      { label: "Stats", path: "/website-stats" },
      { label: "Conact Us", path: "/contactus" },
    ],
  },
  {
    label: "Sponsor Ads",
    icon: Monitor,
    path: "/admin/ads",
  },
  {
    label: "News & Blogs",
    icon: ClipboardList,
    path: "/blogs",
  },
  // {
  //   label: "Problem Center",
  //   icon: AlertTriangle,
  //   submenuKey: "problemCenter",
  //   subItems: [{ label: "Problems", path: "/admin/problemcenter" }],
  // },
  {
    label: "Notification Center",
    icon: Bell,
    submenuKey: "notificationCenter",
    subItems: [{ label: "Notification", path: "/admin/notificationcenter" }],
  },
  {
    label: "Reports",
    icon: ClipboardList,
    submenuKey: "reports",
    subItems: [{ label: "Problem & Reports", path: "/Reportss" }],
  },
  // {
  //   label: "Support Desk",
  //   icon: Headphones,
  //   path: "/support",
  // },
  {
    label: "Stream",
    icon: Radio,
    path: "/stream",
  },
  // {
  //   label: "Watch & Earn",
  //   icon: Gift,
  //   path: "/watch-earn",
  // },
  {
    label: "Refer & Earn",
    icon: Gift,
    path: "/refer-earns",
  },
  {
    label: "Ads Management",
    icon: Gift,
    path: "/ads-management",
  },
  {
    label: "App Settings",
    icon: Settings,
    path: "/app-settings",
  },
  {
    label: "Setting",
    icon: Settings,
    path: "/settings",
  },
  {
    label: "Suscription",
    icon: Radio,
    path: "/suscription",
  },
  {
    label: "Bonus",
    icon: Gift,
    path: "/bonus",
  },
  {
    label: "Referral System",
    icon: Users,
    path: "/referral-system",
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [adminPermissions, setAdminPermissions] = useState([]);
  const location = useLocation();

  // Fetch admin permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(
          "https://macstormbattle-backend-2.onrender.com/api/auth/admin/getadmins",
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU4Nzg0NzM5LCJleHAiOjE3NjAwODA3Mzl9.XYvdilXiq85bii3hm4pMCMlSa0Gw1u4gwb70-Vt9Jto`,
            },
          }
        );
        const data = await response.json();
        // Find the admin with userId 4 (from token)
        const admin = data.find((admin) => admin.id === 4);
        if (admin && admin.permissions) {
          const grantedPermissions = admin.permissions
            .filter((perm) => perm.granted)
            .map((perm) => perm.permission);
          setAdminPermissions(grantedPermissions);
        } else {
          // Fallback: Assume SuperAdmin has all permissions
          setAdminPermissions(menuItems.map((item) => item.label));
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        // Fallback: Show all menu items if API fails
        setAdminPermissions(menuItems.map((item) => item.label));
      }
    };
    fetchPermissions();
  }, []);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMenuItem = (item, depth = 0) => {
    const Icon = item.icon;
    const isSubmenuOpen = openMenus[item.submenuKey];
    const marginClass = depth > 0 ? `ml-${depth * 5}` : "";

    // If item has both path and subItems (like User KYC)
    if (item.path && item.subItems) {
      return (
        <div key={item.label}>
          <div className="flex">
            <Link
              to={item.path}
              className={`flex-1 p-2 rounded-l hover:bg-zinc-300 dark:hover:bg-zinc-700 ${marginClass} ${
                location.pathname === item.path
                  ? "text-primary-600 font-medium bg-zinc-300 dark:bg-zinc-700"
                  : ""
              }`}
            >
              {item.label}
            </Link>
            <button
              onClick={() => toggleMenu(item.submenuKey)}
              className="p-2 rounded-r hover:bg-zinc-300 dark:hover:bg-zinc-700 border-l border-zinc-400 dark:border-zinc-600"
            >
              {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
          {isSubmenuOpen && (
            <div className="ml-5 my-2 space-y-1">
              {item.subItems.map((sub) => renderMenuItem(sub, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // If item has only subItems (expandable menu)
    if (item.subItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.submenuKey)}
            className={`flex w-full items-center justify-between p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 border-b dark:border-zinc-700 ${marginClass}`}
          >
            <span className="flex items-center space-x-2">
              {Icon && <Icon size={18} />}
              <span>{item.label}</span>
            </span>
            {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isSubmenuOpen && (
            <div className="ml-5 my-2 space-y-1">
              {item.subItems.map((sub) => renderMenuItem(sub, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Regular link item
    return (
      <Link
        key={item.label}
        to={item.path}
        className={`block p-3 rounded hover:text-primary-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${marginClass} ${
          location.pathname === item.path
            ? "text-primary-600 font-medium bg-zinc-300 dark:bg-zinc-700"
            : ""
        }`}
      >
        {item.label}
      </Link>
    );
  };

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) =>
    adminPermissions.includes(item.label)
  );

  return (
    <aside className="overflow-y-auto w-64 bg-green-50 dark:bg-zinc-800 text-zinc-800 dark:text-white border-r dark:border-zinc-700 min-h-screen">
      <div className="p-4 text-2xl font-bold">
        MacStorm <span className="text-green-600">Battle</span>{" "}
        <span className="text-green-800">Admin</span>
      </div>
      <nav className="px-4 space-y-3 my-2 text-sm">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isSubmenuOpen = openMenus[item.submenuKey];

          // Handle items with both path and subItems
          if (item.path && item.subItems) {
            return (
              <div key={item.label}>
                <div className="flex">
                  <Link
                    to={item.path}
                    className={`flex-1 flex items-center space-x-2 p-2 rounded-l hover:bg-zinc-300 dark:hover:bg-zinc-700 ${
                      location.pathname === item.path
                        ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                        : ""
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.label}</span>
                  </Link>
                  <button
                    onClick={() => toggleMenu(item.submenuKey)}
                    className="p-2 rounded-r hover:bg-zinc-300 dark:hover:bg-zinc-700 border-l border-zinc-400 dark:border-zinc-600"
                  >
                    {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
                {isSubmenuOpen && (
                  <div className="ml-5 my-2 space-y-1">
                    {item.subItems.map((sub) => renderMenuItem(sub, 0))}
                  </div>
                )}
              </div>
            );
          }

          // Handle items with only subItems
          if (item.subItems) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.submenuKey)}
                  className="flex w-full items-center justify-between p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 border-b dark:border-zinc-700"
                >
                  <span className="flex items-center space-x-2">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </span>
                  {isSubmenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isSubmenuOpen && (
                  <div className="ml-5 my-2 space-y-1">
                    {item.subItems.map((sub) => renderMenuItem(sub, 0))}
                  </div>
                )}
              </div>
            );
          }

          // Handle regular links
          return (
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