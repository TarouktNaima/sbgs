import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ check passwords
    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas ❌");
      return;
    }

    try {
      await api.post(`/reset-password/${id}`, {
        password,
        password_confirmation: confirm,
      });

      setMessage("Mot de passe changé avec succès ✅");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Erreur lors du changement ❌"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-96">

        {/* HEADER */}
        <h1 className="text-4xl font-extrabold text-red-600 text-center mb-2">
          SBGS
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Nouveau mot de passe
        </p>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-sm ${
              message.includes("succès")
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              className="w-full border rounded-lg p-3 pr-10 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                // eye-off
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.42 17.42 0 014.5-5.5M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"/>
                </svg>
              ) : (
                // eye
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmer mot de passe"
              className="w-full border rounded-lg p-3 pr-10 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? (
                // eye-off
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-7-9-7a17.42 17.42 0 014.5-5.5M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"/>
                </svg>
              ) : (
                // eye
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
            Valider
          </button>
        </form>

        {/* RETOUR */}
        <button
          onClick={() => navigate("/")}
          className="mt-5 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 transition"
        >
          ← Retour à la connexion
        </button>
      </div>
    </div>
  );
}