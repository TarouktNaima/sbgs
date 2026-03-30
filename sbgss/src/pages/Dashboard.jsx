import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Users, CheckCircle, Clock } from "lucide-react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    termines: 0,
    services: {},
    recent: [],
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => console.log("API error"));
  }, []);

  // FILTER
  const filteredRecent = stats.recent.filter((s) => {
    if (user.role === "admin") return true;
    if (user.role === "responsable") {
      return s.service?.toLowerCase() === user.service?.toLowerCase();
    }
    return true;
  });

  const filteredServices = {};
  if (user.role === "admin") {
    Object.assign(filteredServices, stats.services);
  } else {
    if (stats.services[user.service]) {
      filteredServices[user.service] = stats.services[user.service];
    }
  }

  const total =
    user.role === "admin" ? stats.total : filteredRecent.length;

  const actifs =
    user.role === "admin"
      ? stats.actifs
      : filteredRecent.filter((s) => s.statut === "Actif").length;

  const termines =
    user.role === "admin"
      ? stats.termines
      : filteredRecent.filter((s) => s.statut === "Terminé").length;

  const data = {
    labels: Object.keys(filteredServices || {}),
    datasets: [
      {
        data: Object.values(filteredServices || {}),
        backgroundColor: "#dc2626",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">

          {/* TOTAL */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow flex justify-between items-center border-l-4 border-red-600">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Total Stagiaires</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                {total}
              </h3>
            </div>
            <div className="bg-red-100 p-2 md:p-3 rounded-full">
              <Users className="text-red-600" size={22} />
            </div>
          </div>

          {/* ACTIFS */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow flex justify-between items-center border-l-4 border-blue-500">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Actifs</p>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-600">
                {actifs}
              </h3>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-full">
              <Clock className="text-blue-600" size={22} />
            </div>
          </div>

          {/* TERMINES */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow flex justify-between items-center border-l-4 border-green-500">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Terminés</p>
              <h3 className="text-2xl md:text-3xl font-bold text-green-600">
                {termines}
              </h3>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-full">
              <CheckCircle className="text-green-600" size={22} />
            </div>
          </div>

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* CHART */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-4 text-gray-700 text-sm md:text-base">
              Stagiaires par service
            </h3>

            <div className="w-full overflow-x-auto">
              <Bar
                data={data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } },
                  },
                }}
                height={250}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow">

            <h3 className="font-semibold mb-4 text-gray-700 text-sm md:text-base">
              Derniers stagiaires
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full text-xs md:text-sm">

                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4">Nom</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4">Service</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4">Statut</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRecent && filteredRecent.length > 0 ? (
                    filteredRecent.map((s, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 md:py-3 px-2 md:px-4 font-medium">
                          {s.nom}
                        </td>

                        <td className="py-2 md:py-3 px-2 md:px-4">
                          {s.service}
                        </td>

                        <td className="py-2 md:py-3 px-2 md:px-4">
                          <span
                            className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold
                            ${
                              s.statut === "Actif"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {s.statut}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-6 text-gray-400">
                        Aucun stagiaire
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;