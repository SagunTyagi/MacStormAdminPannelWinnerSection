// hooks/useAuth.js
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  return { isLoggedIn, loading };
};

export default useAuth;
