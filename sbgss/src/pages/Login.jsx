import { useState, useEffect } from "react";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location = "/dashboard";
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-10 rounded shadow-md w-96 text-center">
        <h1 className="text-5xl font-extrabold text-red-600 mb-6">SBGS</h1>

        <h2 className="text-xl font-semibold">Bienvenue !</h2>

        <p className="text-gray-500 text-sm mb-6">Veuillez vous connecter</p>

        {/* ALERT */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded flex justify-between items-center text-sm">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-2 font-bold">
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD + ICON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full border rounded p-2 pr-10 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                // eye-off
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.42 17.42 0 014.5-5.5M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"
                  />
                </svg>
              ) : (
                // eye
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* FORGOT PASSWORD */}
          <p
            onClick={() => (window.location = "/forgot-password")}
            className="text-sm text-red-600 cursor-pointer hover:underline"
          >
            Mot de passe oublié ?
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;