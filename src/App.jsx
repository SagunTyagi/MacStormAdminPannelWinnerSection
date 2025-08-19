// import { Routes, Route, useLocation, Navigate ,useNavigate} from "react-router-dom";
// import { useEffect, useState } from "react";

// import { getToken } from "firebase/messaging";
// import { ToastContainer } from "react-toastify";
// // Firebase
// import { messaging } from "./firebase";

// import FirebaseNotificationHandler from "./components/FirebaseNotificationHandler";
// import WithdrawRequests from "./pages/WithdrawRequests";


// // Layout
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";

// // Pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import Dashboard from "./pages/Dashboard";
// import AllUsers from "./pages/AllUsers";
// import AllGames from "./pages/AllGames";
// import CreateGame from "./pages/CreateGame";
// import AllMatches from "./pages/AllMatches";
// import CreateMatch from "./pages/CreateMatch";
// import AllVotes from "./pages/AllVotes";
// import Teams from "./pages/Teams";
// import Setting from "./pages/Setting";
// import DailyDuels from "./pages/DailyDuels";
// import Ads from "./pages/Ads";
// import UserSettings from "./pages/UserSettings";
// import UserKYC from "./pages/UserKYC";
// import UserTeams from "./pages/UserTeams";
// import Support from "./pages/Support";
// import PLOverview from "./pages/PLOverview";
// import AdminManagement from "./pages/AdminManagement";
// import SystemHealth from "./pages/SystemHealth";
// import AuditLogViewer from "./pages/AuditLogViewer";
// import ManualLedger from "./pages/ManualLedger";
// import DailyBets from "./pages/DailyBets";
// import ProblemCenter from "./pages/ProblemCenter";
// import NotificationCenter from "./pages/NotificationCenter";
// import Report from "./pages/Report";
// import Match from "./pages/Match";
// import Reportss from "./pages/Reportss"; // Uncomment if this page exists
// import CreateDuel from "./pages/CreateDuel";
// import ImageGallery from "./pages/ImageGallery";
// import Contestcreate from "./pages/contest-create";
// import Contestlist from "./pages/contest-list";
// import ContestDetail from "./pages/contest-details";
// import contestResult from "./pages/content-Result";
// import Bonus from "./pages/Bonus";
// import DuoContestForm from "./pages/DuoContestForm";
// import DeclareResult from "./pages/DeclareResult";
// import DuoContest from "./pages/DuoContest";
// import Kyc from "./pages/Kyc";

// import SquadContestForm from "./pages/SquadContestForm";
// import SquadContestsList from "./pages/SquadContestList";
// import SquadContest from "./pages/SquadContest";
// import SquadContestDeclareResult from "./pages/SquadContestDeclareResult";
// import ContestResultDeclaration from "./pages/content-Result";
// // import NotificationCenter from './pages/NotificationCenter'
// // Auth util (you must create this hook)
// // import useAuth from "./hooks/useAuth";

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const location = useLocation();
//   const authRoutes = ["/login", "/register", "/forgot-password"];
//   const isAuthPage = authRoutes.includes(location.pathname);
// const [isLoggedIn, setIsLoggedIn] = useState(false);


//   if (isAuthPage) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-zinc-500 transition-colors duration-300">
//         <FirebaseNotificationHandler />
//         <ToastContainer />
//         <Routes>
//           <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//         </Routes>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-neutral-200 dark:bg-zinc-500 transition-colors duration-300 w-full">
//       {isSidebarOpen && <Sidebar />}
//       <div className="flex-1 flex flex-col">
//         <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} setIsLoggedIn={setIsLoggedIn} />
//         <FirebaseNotificationHandler />
//         <ToastContainer />

//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/users" element={<AllUsers />} />
//           <Route path="/teams" element={<Teams />} />
//           <Route path="/games" element={<AllGames />} />
//           <Route path="/games/create" element={<CreateGame />} />
//           <Route path="/games/edit/:id" element={<CreateGame />} />
//           <Route path="/matches" element={<AllMatches />} />
//           <Route path="/matches/create" element={<CreateMatch />} />
//           <Route path="/admin/duels" element={<DailyDuels />} />
//           <Route path="/admin/ads" element={<Ads />} />
//           <Route path="/voting-centre" element={<AllVotes />} />
//           <Route path="/p&l-overview" element={<PLOverview />} />
//           <Route path="/admin-management" element={<AdminManagement />} />
//           <Route path="/system-health" element={<SystemHealth />} />
//           <Route path="/audit-log" element={<AuditLogViewer />} />
//           <Route path="/manual-ledger" element={<ManualLedger />} />
//           <Route path="/user-settings" element={<UserSettings />} />
//           <Route path="/user-kyc" element={<UserKYC />} />
//           <Route path="/user-teams" element={<UserTeams />} />
//           <Route path="/support" element={<Support />} />
//           <Route path="/admin/problemcenter" element={<ProblemCenter />} />
//           <Route
//             path="/admin/notificationcenter"
//             element={<NotificationCenter />}
//           />
//           <Route path="/admin/reports" element={<Report />} />
//           <Route path="/admin/bets" element={<DailyBets />} />
//           <Route path="/admin/matches" element={<Match />} />
//           <Route path="/settings" element={<Setting />} />
//           <Route path="/bonus" element={<Bonus />} />
//           <Route path="/reportss" element={<Reportss />} />
//           <Route path="/admin/duels/createduel" element={<CreateDuel />} />
//           <Route path="/admin/images" element={<ImageGallery />} />
//           <Route path="/admin/withdrawals" element={<WithdrawRequests />} />
//           <Route path="/admin/notifications" element={<NotificationCenter />} />
//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;
import { Routes, Route, useLocation, Navigate ,useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";

import { getToken } from "firebase/messaging";
import { ToastContainer } from "react-toastify";
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
import AllVotes from "./pages/AllVotes";
import Teams from "./pages/Teams";
import Setting from "./pages/Setting";
import DailyDuels from "./pages/DailyDuels";
import Ads from "./pages/Ads";
import UserSettings from "./pages/UserSettings";
import UserKYC from "./pages/UserKYC";
import UserTeams from "./pages/UserTeams";
import Support from "./pages/Support";
import PLOverview from "./pages/PLOverview";
import AdminManagement from "./pages/AdminManagement";
import SystemHealth from "./pages/SystemHealth";
import AuditLogViewer from "./pages/AuditLogViewer";
import ManualLedger from "./pages/ManualLedger";
import DailyBets from "./pages/DailyBets";
import ProblemCenter from "./pages/ProblemCenter";
import NotificationCenter from "./pages/NotificationCenter";
import Report from "./pages/Report";
import Match from "./pages/Match";
import Reportss from "./pages/Reportss"; // Uncomment if this page exists
import CreateDuel from "./pages/CreateDuel";
import ImageGallery from "./pages/ImageGallery";
import Contestcreate from "./pages/contest-create";
import Contestlist from "./pages/contest-list";
import ContestDetail from "./pages/contest-details";
import contestResult from "./pages/content-Result";
import Bonus from "./pages/Bonus";
import DuoContestForm from "./pages/DuoContestForm";
import DeclareResult from "./pages/DeclareResult";
import DuoContest from "./pages/DuoContest";
import Kyc from "./pages/Kyc";

import SquadContestForm from "./pages/SquadContestForm";
import SquadContestsList from "./pages/SquadContestList";
import SquadContest from "./pages/SquadContest";
import SquadContestDeclareResult from "./pages/SquadContestDeclareResult";
import ContestResultDeclaration from "./pages/content-Result";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authRoutes.includes(location.pathname);
const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const authToken = localStorage.getItem("authToken");

  if (isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-200 dark:bg-zinc-500 transition-colors duration-300">
        <FirebaseNotificationHandler />
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-200 dark:bg-zinc-500 transition-colors duration-300 w-full">
      {isSidebarOpen && <Sidebar />}
      <div className="flex-1 flex-col overflow-y-auto">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <FirebaseNotificationHandler />
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/games" element={<AllGames />} />
          <Route path="/games/create" element={<CreateGame />} />
          <Route path="/games/edit/:id" element={<CreateGame />} />
          <Route path="/matches" element={<AllMatches />} />
          <Route path="/matches/create" element={<CreateMatch />} />
          <Route path="/admin/duels" element={<DailyDuels />} />
          <Route path="/admin/ads" element={<Ads />} />
          <Route path="/voting-centre" element={<AllVotes />} />
          <Route path="/p&l-overview" element={<PLOverview />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/system-health" element={<SystemHealth />} />
          <Route path="/audit-log" element={<AuditLogViewer />} />
          <Route path="/manual-ledger" element={<ManualLedger />} />
          <Route path="/user-settings" element={<UserSettings />} />
          <Route path="/user-kyc" element={<UserKYC />} />
          <Route path="/user-teams" element={<UserTeams />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin/problemcenter" element={<ProblemCenter />} />
          <Route
            path="/admin/notificationcenter"
            element={<NotificationCenter />}
          />
          <Route path="/admin/reports" element={<Report />} />
          <Route path="/admin/bets" element={<DailyBets />} />
          <Route path="/admin/matches" element={<Match />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/bonus" element={<Bonus />} />
          <Route path="/reportss" element={<Reportss />} />
          <Route path="/admin/duels/createduel" element={<CreateDuel />} />
          <Route path="/admin/images" element={<ImageGallery />} />
          <Route path="/contest-create" element={<Contestcreate />} />
          <Route path="/contest-list" element={<Contestlist />} />
          <Route path="/contest-details/:id" element={<ContestDetail />} />
          <Route path="/contest-result/:id" element={<contestResult />} />
          <Route path="/duo/create" element={<DuoContestForm />} />
          <Route path="/duo/result/:id" element={<DeclareResult />} />
          <Route path="/duoContests" element={<DuoContest />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/solo/create" element={<Contestcreate />} />
          <Route path="/solo" element={<Contestlist />} />
          <Route path="/solo/:id" element={<ContestDetail />} />
          <Route path="/solo/:id/declare-result" element={<ContestResultDeclaration />} />

          {/* squad contest */}
          <Route path="/squad/" element={<SquadContestsList />} />
          <Route path="/squad/create" element={<SquadContestForm />} />
          <Route path="/squad/:id" element={<SquadContest />} />
          <Route
            path="/squad/:id/declare-result"
            element={<SquadContestDeclareResult />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;