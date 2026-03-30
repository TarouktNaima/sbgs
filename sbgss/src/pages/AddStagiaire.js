import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

function AddStagiaire() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    service: "",
    date_debut: "",
    date_fin: "",
    statut: ""
  });

  const [openModal, setOpenModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: false
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.nom) newErrors.nom = true;
    if (!form.prenom) newErrors.prenom = true;
    if (!form.email) newErrors.email = true;
    if (!form.service) newErrors.service = true;
    if (!form.statut) newErrors.statut = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      setErrorModal(true);
      return;
    }

    api.post("/stagiaires", form)
      .then(() => {
        setOpenModal(true);
      })
      .catch(() => {
        setErrorModal(true);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Navbar />

      <div className="flex justify-center items-center py-6 md:py-10 px-3">

        <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl shadow-xl w-full max-w-xl">

          <h2 className="text-xl md:text-2xl font-bold text-center text-red-600 mb-6 md:mb-8">
            Ajouter Stagiaire
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

            {/* NOM */}
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              onChange={handleChange}
              className={`w-full p-2 md:p-3 text-sm md:text-base border rounded-xl outline-none
              ${errors.nom ? "border-red-500" : "focus:ring-2 focus:ring-red-500"}`}
            />

            {/* PRENOM */}
            <input
              type="text"
              name="prenom"
              placeholder="Prenom"
              onChange={handleChange}
              className={`w-full p-2 md:p-3 text-sm md:text-base border rounded-xl outline-none
              ${errors.prenom ? "border-red-500" : "focus:ring-2 focus:ring-red-500"}`}
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full p-2 md:p-3 text-sm md:text-base border rounded-xl outline-none
              ${errors.email ? "border-red-500" : "focus:ring-2 focus:ring-red-500"}`}
            />

            {/* TELEPHONE */}
            <input
              type="text"
              name="telephone"
              placeholder="Téléphone"
              onChange={handleChange}
              className="w-full p-2 md:p-3 text-sm md:text-base border rounded-xl"
            />

            {/* SERVICE (بدلناه select باش يكون أحسن) */}
            <select
              name="service"
              onChange={handleChange}
              className={`w-full p-2 md:p-3 text-sm md:text-base border rounded-xl
              ${errors.service ? "border-red-500" : "focus:ring-2 focus:ring-red-500"}`}
            >
              <option value="">Choisir service</option>
              <option value="IT">IT</option>
              <option value="RH">RH</option>
              <option value="Finance">Finance</option>
            </select>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <input
                type="date"
                name="date_debut"
                onChange={handleChange}
                className="w-full p-2 md:p-3 border rounded-xl"
              />

              <input
                type="date"
                name="date_fin"
                onChange={handleChange}
                className="w-full p-2 md:p-3 border rounded-xl"
              />
            </div>

            {/* STATUS */}
            <div>
              <p className="text-gray-600 mb-2 text-sm md:text-base">Statut</p>

              <div className="flex gap-4 md:gap-6 text-sm md:text-base">
                <label className="flex items-center gap-2">
                  <input type="radio" name="statut" value="Actif" onChange={handleChange} />
                  Actif
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" name="statut" value="Terminé" onChange={handleChange} />
                  Terminé
                </label>
              </div>

              {errors.statut && (
                <p className="text-red-500 text-xs mt-1">
                  Choisir un statut
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 md:py-3 text-sm md:text-base rounded-xl md:rounded-2xl hover:bg-red-700 transition font-semibold"
            >
              Enregistrer
            </button>

          </form>

        </div>

      </div>

      {/* SUCCESS */}
      <AnimatePresence>
        {openModal && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <motion.div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl w-80 md:w-96 text-center">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={40} />
              <h2 className="text-lg md:text-xl font-bold mb-2">Ajout réussi</h2>
              <p className="text-gray-500 mb-6 text-sm md:text-base">
                Stagiaire ajouté avec succès.
              </p>

              <button
                onClick={() => navigate("/stagiaires")}
                className="px-5 py-2 rounded-xl bg-red-600 text-white"
              >
                Retour
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR */}
      <AnimatePresence>
        {errorModal && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <motion.div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl w-80 md:w-96 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-lg md:text-xl font-bold text-red-600 mb-2">Erreur</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Remplir les champs obligatoires
              </p>

              <button
                onClick={() => setErrorModal(false)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AddStagiaire;