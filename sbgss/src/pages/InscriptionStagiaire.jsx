import { useState } from "react";
import api from "../api/axios";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Upload,
} from "lucide-react";

function InscriptionStagiaire() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    service: "",
    date_debut: "",
    date_fin: "",
    statut: "Actif",
    cv: null,
    convention: null,
    rapport: null,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    const newValue = files ? files[0] : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors(
      validate({
        ...form,
        [name]: newValue,
      })
    );
  };

  const validate = (data) => {
    let newErrors = {};

    if (!data.nom?.trim()) newErrors.nom = "Nom obligatoire";
    if (!data.prenom?.trim()) newErrors.prenom = "Prénom obligatoire";

    if (!data.email?.trim()) {
      newErrors.email = "Email obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email invalide";
    }

    if (!data.telephone?.trim()) {
      newErrors.telephone = "Téléphone obligatoire";
    } else if (!/^[0-9]+$/.test(data.telephone)) {
      newErrors.telephone = "Numéro invalide";
    }

    if (!data.service) newErrors.service = "Service obligatoire";

    if (!data.date_debut)
      newErrors.date_debut = "Date début obligatoire";

    if (!data.date_fin) {
      newErrors.date_fin = "Date fin obligatoire";
    } else if (
      data.date_debut &&
      new Date(data.date_fin) < new Date(data.date_debut)
    ) {
      newErrors.date_fin =
        "Date fin doit être après date début";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setTouched(allTouched);

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    try {
      await api.post("/stagiaires", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        message: "Inscription réussie !",
        type: "success",
      });

      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);

      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        service: "",
        date_debut: "",
        date_fin: "",
        statut: "Actif",
        cv: null,
        convention: null,
        rapport: null,
      });

      setErrors({});
      setTouched({});
    } catch (error) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;

        const formattedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          let message = backendErrors[key][0];

          if (
            key === "email" &&
            message.toLowerCase().includes("taken")
          ) {
            message = "Email déjà utilisé";
          }

          formattedErrors[key] = message;
        });

        setErrors(formattedErrors);

        setAlert({
          show: true,
          message: "Erreur de validation",
          type: "error",
        });

        setTimeout(() => {
          setAlert({ show: false, message: "", type: "" });
        }, 3000);

        return;
      }

      setAlert({
        show: true,
        message: "Erreur serveur !",
        type: "error",
      });

      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  const inputStyle =
    "w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center p-6">
      {/* ALERT */}
      {alert.show && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg text-white ${
            alert.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl"
      >
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
          SBGS - Inscription Stagiaire
        </h1>

        {/* PERSONNEL */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Informations personnelles
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            icon={<User className="text-gray-400" />}
            name="nom"
            placeholder="Nom"
            form={form}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />

          <Input
            icon={<User className="text-gray-400" />}
            name="prenom"
            placeholder="Prénom"
            form={form}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />

          <Input
            icon={<Mail className="text-gray-400" />}
            name="email"
            placeholder="Email"
            type="email"
            form={form}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />

          <Input
            icon={<Phone className="text-gray-400" />}
            name="telephone"
            placeholder="Téléphone"
            form={form}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />
        </div>

        {/* STAGE */}
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
          Informations stage
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 text-gray-400" />
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className={`${inputStyle} pl-10`}
            >
              <option value="">Choisir service</option>
              <option value="IT">IT</option>
              <option value="RH">RH</option>
              <option value="Finance">Finance</option>
            </select>
            {touched.service && errors.service && (
              <p className="text-red-500 text-sm">
                {errors.service}
              </p>
            )}
          </div>

          {/* DATE DEBUT */}
          <div>
            <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-red-600" />
              Date début
            </label>

            <input
              type="date"
              name="date_debut"
              value={form.date_debut}
              onChange={handleChange}
              className={inputStyle}
            />

            {touched.date_debut && errors.date_debut && (
              <p className="text-red-500 text-sm">
                {errors.date_debut}
              </p>
            )}
          </div>

          {/* DATE FIN */}
          <div>
            <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-red-600" />
              Date fin
            </label>

            <input
              type="date"
              name="date_fin"
              value={form.date_fin}
              onChange={handleChange}
              className={inputStyle}
            />

            {touched.date_fin && errors.date_fin && (
              <p className="text-red-500 text-sm">
                {errors.date_fin}
              </p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              💡 La date de fin doit être après la date de début
            </p>
          </div>
        </div>

        {/* STATUT */}
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
          Statut
        </h2>

        <div className="flex gap-6">
          <label>
            <input
              type="radio"
              name="statut"
              value="Actif"
              checked={form.statut === "Actif"}
              onChange={handleChange}
            />
            Actif
          </label>

          <label>
            <input
              type="radio"
              name="statut"
              value="Terminé"
              checked={form.statut === "Terminé"}
              onChange={handleChange}
            />
            Terminé
          </label>
        </div>

        {/* FILES */}
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
          Documents à fournir
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {["cv", "convention", "rapport"].map((doc) => (
            <label
              key={doc}
              className="border rounded-xl p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50"
            >
              <Upload className="text-gray-400 mb-2" />
              {doc.toUpperCase()}
              <input
                type="file"
                name={doc}
                hidden
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="mt-8 w-full bg-red-600 text-white py-3 rounded-2xl hover:bg-red-700 transition"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default InscriptionStagiaire;

/* SMALL INPUT COMPONENT */
function Input({
  icon,
  name,
  placeholder,
  type = "text",
  form,
  handleChange,
  errors,
  touched,
}) {
  return (
    <div>
      <div className="relative">
        <div className="absolute left-3 top-3">{icon}</div>

        <input
          type={type}
          name={name}
          value={form[name]}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none"
        />
      </div>

      {touched[name] && errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]}</p>
      )}
    </div>
  );
}