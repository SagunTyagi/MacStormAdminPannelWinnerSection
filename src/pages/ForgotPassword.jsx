import React, { useState } from "react";
import axiosInstance from "../utils/axios"; // Make sure this has baseURL setup
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMessage("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/admin/forgot-password", { email });
      setMessage(response.data.message || "Reset link sent successfully!");
      setEmail(""); // clear field
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset link.";
      setEmailError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl space-y-6 bg-white dark:bg-zinc-800 p-10 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Forgot Password</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enter your email to receive a reset link
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                emailError ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
              } bg-neutral-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-zinc-500 outline-none`}
            />
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
            {message && <p className="text-sm text-green-500 mt-1">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Remember your password?{" "}
              <a href="/login" className="text-zinc-800 dark:text-white font-medium hover:underline">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
