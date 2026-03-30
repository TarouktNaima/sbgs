import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";

export default function VoirStagiaire() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stagiaire, setStagiaire] = useState(null);

  useEffect(() => {
    api
      .get(`/stagiaires/${id}`)
      .then((res) => setStagiaire(res.data))
      .catch(() => alert("Erreur chargement"));
  }, [id]);

  if (!stagiaire) {
    return <div className="p-10 text-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          {/* HEADER 🔴 */}
          <h1 className="text-2xl font-bold text-red-600 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={22} />
              Détail du stagiaire
            </div>

            <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
              ID: {id}
            </span>
          </h1>

          {/* INFOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Info icon={<User size={18} />} label="Nom" value={stagiaire.nom} />
            <Info icon={<User size={18} />} label="Prénom" value={stagiaire.prenom} />
            <Info icon={<Mail size={18} />} label="Email" value={stagiaire.email} />
            <Info icon={<Phone size={18} />} label="Téléphone" value={stagiaire.telephone} />
            <Info icon={<Briefcase size={18} />} label="Service" value={stagiaire.service} />
            <Info icon={<Calendar size={18} />} label="Date début" value={stagiaire.date_debut} />
            <Info icon={<Calendar size={18} />} label="Date fin" value={stagiaire.date_fin} />

            {/* STATUT */}
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Statut
              </p>

              <span
                className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold ${
                  stagiaire.statut === "Actif"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {stagiaire.statut}
              </span>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <FileText className="text-red-600" />
              Documents
            </h2>

            <div className="space-y-3">
              {stagiaire.documents && stagiaire.documents.length > 0 ? (
                stagiaire.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={`http://127.0.0.1:8000/storage/${doc.nom_fichier}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl hover:border-red-400 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-2 text-gray-700">
                      <FileText size={18} className="text-red-600" />
                      <span className="font-medium">
                        {doc.type_document}
                      </span>
                    </div>

                    <span className="text-red-600 text-sm font-medium">
                      Ouvrir →
                    </span>
                  </a>
                ))
              ) : (
                <p className="text-gray-400">Aucun document</p>
              )}
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/stagiaires")}
              className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition"
            >
              Retour
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* INFO CARD */
function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 p-4 rounded-xl hover:shadow-sm transition">
      <div className="text-red-600 mt-1">{icon}</div>

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}