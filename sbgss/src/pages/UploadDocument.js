import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

function UploadDocument() {

  const navigate = useNavigate();

  const [stagiaires, setStagiaires] = useState([]);
  const [form, setForm] = useState({
    stagiaire_id: "",
    type_document: "",
    file: null
  });

  const [errors, setErrors] = useState({});
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  // ✅ user
  const user = JSON.parse(localStorage.getItem("user"));

  // 📌 fetch stagiaires
  useEffect(() => {
    api.get("/stagiaires")
      .then(res => setStagiaires(res.data))
      .catch(() => console.log("error stagiaires"));
  }, []);

  // ✅ FILTER stagiaires
  const filteredStagiaires = stagiaires.filter((s) => {
    if (user.role === "admin") return true;

    if (user.role === "responsable") {
      return (
        s.service?.toLowerCase() === user.service?.toLowerCase()
      );
    }

    return true;
  });

  // 📌 handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: false
    });
  };

  // 📌 file
  const handleFile = (e) => {
    setForm({
      ...form,
      file: e.target.files[0]
    });

    setErrors({
      ...errors,
      file: false
    });
  };

  // 📌 validation
  const validate = () => {
    let newErrors = {};

    if (!form.stagiaire_id) newErrors.stagiaire_id = true;
    if (!form.type_document) newErrors.type_document = true;
    if (!form.file) newErrors.file = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 📌 submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      setErrorModal(true);
      return;
    }

    const data = new FormData();
    data.append("stagiaire_id", form.stagiaire_id);
    data.append("type_document", form.type_document);
    data.append("file", form.file);

    api.post("/documents/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => {
      setSuccessModal(true);
    })
    .catch((err) => {
      console.log(err.response);
      setErrorModal(true);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">

      <Navbar />

      <div className="flex justify-center items-center py-10">

        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-xl">

          <h2 className="text-2xl font-bold text-center text-red-600 mb-8">
            Upload Document
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* STAGIAIRE */}
            <select
              name="stagiaire_id"
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl outline-none
              ${errors.stagiaire_id ? "border-red-500" : "focus:ring-2 focus:ring-red-500"}`}
            >
              <option value="">Select Stagiaire</option>

              {filteredStagiaires.map((s) => (
                <option key={s.id_stagiaire} value={s.id_stagiaire}>
                  {s.nom} {s.prenom}
                </option>
              ))}

            </select>

            {/* TYPE */}
            <select
              name="type_document"
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl outline-none
              ${errors.type_document ? "border-red-500" : "focus:ring-2 focus:ring-red-500"}`}
            >
              <option value="">Select Type</option>
              <option value="CV">CV</option>
              <option value="Convention">Convention</option>
              <option value="Rapport">Rapport</option>
            </select>

            {/* FILE */}
            <input
              type="file"
              onChange={handleFile}
              className={`w-full p-3 border rounded-xl
              ${errors.file ? "border-red-500" : ""}`}
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-2xl hover:bg-red-700 transition font-semibold"
            >
              Upload
            </button>

          </form>

        </div>

      </div>

      {/* ✅ SUCCESS MODAL */}
      <AnimatePresence>
        {successModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-2xl w-96 text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <CheckCircle className="mx-auto text-green-500 mb-4" size={50} />

              <h2 className="text-xl font-bold mb-2">
                Upload réussi
              </h2>

              <p className="text-gray-500 mb-6">
                Document ajouté avec succès.
              </p>

              <button
                onClick={() => navigate("/documents")}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Retour
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ ERROR MODAL */}
      <AnimatePresence>
        {errorModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-2xl w-96 text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="text-red-500 text-5xl mb-4">⚠️</div>

              <h2 className="text-xl font-bold text-red-600 mb-2">
                Erreur
              </h2>

              <p className="text-gray-500 mb-6">
                Vérifiez les champs ou réessayez.
              </p>

              <button
                onClick={() => setErrorModal(false)}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
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

export default UploadDocument;