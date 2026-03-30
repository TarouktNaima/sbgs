import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/check-email", { email });
      navigate(`/reset-password/${res.data.user_id}`);
    } catch {
      setError("Email non trouvé");
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
          Récupération du mot de passe
        </p>

        {/* ALERT */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full border rounded-lg p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
            Continuer
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