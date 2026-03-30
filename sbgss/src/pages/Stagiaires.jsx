import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Pencil, Trash2, Users } from "lucide-react";

export default function Stagiaires() {
  const [stagiaires, setStagiaires] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchStagiaires = () => {
    api
      .get("/stagiaires")
      .then((res) => setStagiaires(res.data))
      .catch(() => console.log("error"));
  };

  useEffect(() => {
    fetchStagiaires();
  }, []);

  const confirmDelete = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const handleDelete = () => {
    api
      .delete(`/stagiaires/${selectedId}`)
      .then(() => {
        fetchStagiaires();
        setOpenModal(false);
      })
      .catch(() => alert("Erreur suppression"));
  };

  // FILTER ROLE
  const filtered = stagiaires.filter((s) => {
    if (user.role === "admin") return true;
    if (user.role === "responsable") {
      return s.service?.toLowerCase() === user.service?.toLowerCase();
    }
    return true;
  });

  // SEARCH
  const filteredSearch = filtered.filter((s) =>
    `${s.nom} ${s.prenom} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-red-600" /> Liste des stagiaires
          </h1>

          {user.role === "admin" && (
            <button
              onClick={() => navigate("/add-stagiaire")}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow hover:scale-105 hover:bg-red-700 transition text-sm md:text-base"
            >
              <Plus size={18} /> Ajouter
            </button>
          )}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow p-3 md:p-4 mb-5 md:mb-6 flex items-center gap-2 md:gap-3 w-full md:w-96">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full text-sm md:text-base"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-x-auto">

          <table className="w-full min-w-[600px] text-xs md:text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 md:p-4 text-left">Nom</th>
                <th className="p-3 md:p-4 text-left">Prenom</th>
                <th className="p-3 md:p-4 text-left">Email</th>
                <th className="p-3 md:p-4 text-left">Service</th>
                <th className="p-3 md:p-4 text-left">Statut</th>
                <th className="p-3 md:p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSearch.length > 0 ? (
                filteredSearch.map((s) => (
                  <motion.tr
                    key={s.id_stagiaire}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 md:p-4 font-semibold">{s.nom}</td>
                    <td className="p-3 md:p-4">{s.prenom}</td>
                    <td className="p-3 md:p-4 text-gray-500 break-all">
                      {s.email}
                    </td>
                    <td className="p-3 md:p-4">{s.service}</td>

                    <td className="p-3 md:p-4">
                      <span
                        className={`px-2 md:px-4 py-1 rounded-full text-[10px] md:text-xs font-bold ${
                          s.statut === "Actif"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {s.statut}
                      </span>
                    </td>

                    <td className="p-3 md:p-4 flex gap-1 md:gap-2">

                      {/* VOIR */}
                      <button
                        onClick={() =>
                          navigate(`/stagiaire/${s.id_stagiaire}`)
                        }
                        className="p-2 rounded-lg md:rounded-xl bg-gray-100 hover:bg-gray-600 hover:text-white"
                      >
                        👁️
                      </button>

                      {/* EDIT */}
                      {(user.role === "admin" ||
                        user.role === "responsable") && (
                        <button
                          onClick={() =>
                            navigate(`/edit-stagiaire/${s.id_stagiaire}`)
                          }
                          className="p-2 rounded-lg md:rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <Pencil size={14} />
                        </button>
                      )}

                      {/* DELETE */}
                      {user.role === "admin" && (
                        <button
                          onClick={() => confirmDelete(s.id_stagiaire)}
                          className="p-2 rounded-lg md:rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-400">
                    Aucun stagiaire
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <motion.div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl w-80 md:w-96 text-center">
              <div className="text-4xl md:text-5xl mb-4">🗑️</div>

              <h2 className="text-lg md:text-xl font-bold mb-2">
                Confirmer suppression
              </h2>

              <p className="text-gray-500 mb-6 text-sm md:text-base">
                Voulez-vous supprimer ce stagiaire ?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 md:px-5 py-2 rounded-xl bg-gray-200"
                >
                  Annuler
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 md:px-5 py-2 rounded-xl bg-red-600 text-white"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}