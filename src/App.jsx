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

// Auth util (you must create this hook)
// import useAuth from "./hooks/useAuth";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  // const { isLoggedIn } = useAuth();
  const authToken = localStorage.getItem("authToken");
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authRoutes.includes(location.pathname);

  // Redirect to login if not authenticated and not on auth page
  // useEffect(() => {
  //   if (!isLoggedIn && !isAuthPage) {
  //     window.location.href = "/login";
  //   }
  // }, [isLoggedIn, isAuthPage]);

  // Register Firebase Messaging Service Worker
  useEffect(() => {
    const registerFcm = async () => {
      try {
        if (!("serviceWorker" in navigator)) {
          console.error("Service Worker not supported in this browser");
          return;
        }

        let registration = await navigator.serviceWorker.getRegistration(
          "/firebase-messaging-sw.js"
        );

        if (!registration) {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
              type: "module",
            }
          );

          await new Promise((resolve) => {
            if (registration.active) return resolve();
            registration.addEventListener("updatefound", () => {
              const installingWorker = registration.installing;
              installingWorker.addEventListener("statechange", () => {
                if (installingWorker.state === "activated") {
                  resolve();
                }
              });
            });
          });
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        const currentToken = await getToken(messaging, {
          vapidKey:
            "BCI-Cu-Pg0FnXdyxDeR6LHozhMO_5Ft5I5VIi7bI8ofJhOrHMffJgNbPnHczr1Rtlu9rqVKalQRkQJ5pC6qsc6c",
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          localStorage.setItem("fcmToken", currentToken);
        } else {
          console.warn("No registration token available");
        }
      } catch (error) {
        console.error("FCM registration error:", error);
      }
    };

    registerFcm();
  }, []);


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
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
