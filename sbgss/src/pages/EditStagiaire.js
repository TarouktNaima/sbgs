import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function EditStagiaire() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    service: "",
    statut: "",
  });

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    api
      .get(`/stagiaires/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => console.log("error"));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    api
      .put(`/stagiaires/${id}`, form)
      .then(() => {
        setOpenModal(true);
      })
      .catch(() => alert("Erreur update"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar />

      <div className="max-w-xl mx-auto p-8 bg-white mt-10 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Modifier Stagiaire
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="text"
            placeholder="Prenom"
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="text"
            placeholder="Service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />

          <select
            value={form.statut}
            onChange={(e) => setForm({ ...form, statut: e.target.value })}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="">Choisir statut</option>
            <option value="Actif">Actif</option>
            <option value="Terminé">Terminé</option>
          </select>

          <button className="bg-red-600 text-white px-4 py-3 rounded-2xl w-full hover:bg-red-700 transition font-semibold">
            Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl w-96 text-center"
            >
              <CheckCircle className="mx-auto text-green-500 mb-4" size={50} />

              <h2 className="text-xl font-bold mb-2">
                Modification réussie
              </h2>

              <p className="text-gray-500 mb-6">
                Les informations du stagiaire ont été mises à jour.
              </p>

              <button
                onClick={() => navigate("/stagiaires")}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Retour à la liste
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
