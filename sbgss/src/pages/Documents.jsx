import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, Upload, FileText } from "lucide-react";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchDocuments = () => {
    api.get("/documents")
      .then(res => setDocuments(res.data))
      .catch(() => console.log("error"));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const confirmDelete = (doc) => {
    setSelectedDoc(doc);
    setOpenModal(true);
  };

  const handleDelete = () => {
    const id = selectedDoc.id || selectedDoc.id_document;

    api.delete(`/documents/${id}`)
      .then(() => {
        fetchDocuments();
        setOpenModal(false);
      })
      .catch(() => alert("Erreur suppression"));
  };

  // ✅ FILTER
  const filteredDocs = documents.filter((doc) => {
    if (user.role === "admin") return true;

    if (user.role === "responsable") {
      return (
        doc.stagiaire?.service?.toLowerCase() ===
        user.service?.toLowerCase()
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar />

      {/* 📱 padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">

        {/* 📱 header responsive */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-red-600" />
            Documents
          </h1>

          <button
            onClick={() => navigate("/upload-document")}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow hover:scale-105 hover:bg-red-700 transition w-full md:w-auto"
          >
            <Upload size={18} />
            Upload
          </button>

        </div>

        {/* 📱 table wrapper scroll */}
        <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">

          <table className="w-full min-w-[600px]">

            <thead className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
              <tr>
                <th className="p-3 sm:p-4 text-left">Stagiaire</th>
                <th className="p-3 sm:p-4 text-left">Type</th>
                <th className="p-3 sm:p-4 text-left">Fichier</th>
                <th className="p-3 sm:p-4 text-left">Date</th>
                <th className="p-3 sm:p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, index) => {
                  const id = doc.id || doc.id_document;

                  return (
                    <motion.tr
                      key={id || index}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3 sm:p-4 font-semibold text-gray-700 text-sm sm:text-base">
                        {doc.stagiaire
                          ? `${doc.stagiaire.nom} ${doc.stagiaire.prenom}`
                          : "—"}
                      </td>

                      <td className="p-3 sm:p-4 text-sm">
                        {doc.type_document}
                      </td>

                      <td className="p-3 sm:p-4 text-gray-500 text-xs sm:text-sm break-all">
                        {doc.nom_fichier}
                      </td>

                      <td className="p-3 sm:p-4 text-gray-400 text-xs sm:text-sm">
                        {doc.created_at?.slice(0, 10)}
                      </td>

                      <td className="p-3 sm:p-4 flex gap-2">

                        <a
                          href={`http://127.0.0.1:8000/storage/${doc.nom_fichier}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                        >
                          <Eye size={16} />
                        </a>

                        {user.role === "admin" && (
                          <button
                            onClick={() => confirmDelete(doc)}
                            className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                      </td>

                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-400">
                    Aucun document
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">

            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center">

              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Confirmer suppression
              </h2>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                >
                  Annuler
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl"
                >
                  Supprimer
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Documents;