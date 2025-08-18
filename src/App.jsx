import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";
import { ToastContainer } from "react-toastify";
import DailyDuels from "./pages/DailyDuels";
import Ads from "./pages/Ads";
import CreateDuel from "./pages/CreateDuel";
import ImageGallery from "./pages/ImageGallery";
// Firebase
import { messaging } from "./firebase";

import FirebaseNotificationHandler from "./components/FirebaseNotificationHandler";
import WithdrawRequests from "./pages/WithdrawRequests";


// Layout
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/AllUsers";
import AllGames from "./pages/AllGames";
import CreateGame from "./pages/CreateGame";
import AllMatches from "./pages/AllMatches";
import CreateMatch from "./pages/CreateMatch";
import NotificationCenter from './pages/NotificationCenter'
// Auth util (you must create this hook)
// import useAuth from "./hooks/useAuth";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  // const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem("authToken");
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authRoutes.includes(location.pathname);


  // ✅ AUTH PAGES (Login/Register) should always be accessible
  if (isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-zinc-500 transition-colors duration-300">
        <FirebaseNotificationHandler />
        <ToastContainer />
        <Routes>
          <Route
            path="/login"
            element={authToken ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={authToken ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  // ✅ MAIN APP (protected)
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-200 dark:bg-zinc-500 transition-colors duration-300">
      {isSidebarOpen && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <FirebaseNotificationHandler />
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/games" element={<AllGames />} />
          <Route path="/games/create" element={<CreateGame />} />
          <Route path="/games/edit/:id" element={<CreateGame />} />
          <Route path="/matches" element={<AllMatches />} />
          <Route path="/matches/create" element={<CreateMatch />} />
          <Route path="/admin/duels" element={<DailyDuels />} />
          <Route path="/admin/ads" element={<Ads />} />
          <Route path="/admin/duels/createduel" element={<CreateDuel />} />
          <Route path="/admin/images" element={<ImageGallery />} />
          <Route path="/admin/withdrawals" element={<WithdrawRequests />} />
          <Route path="/admin/notifications" element={<NotificationCenter />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
