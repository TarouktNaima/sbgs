import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `relative pb-1 ${
      location.pathname === path
        ? "text-red-600 font-semibold"
        : "text-gray-700"
    } hover:text-red-600 transition`;

  return (
    <div className="bg-white shadow-sm px-4 md:px-10 py-3 md:py-4 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-2 md:gap-3">
        <img
          src="/logoo.png"
          alt="logo"
          className="h-7 md:h-10 object-contain"
        />
        <h1 className="text-lg md:text-2xl font-extrabold text-red-600 tracking-wide">
          SBGS
        </h1>
      </div>

      {/* CENTER LINKS */}
      <div className="flex gap-4 md:gap-10 text-sm md:text-lg">

        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
          {location.pathname === "/dashboard" && (
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-red-600 rounded"></span>
          )}
        </Link>

        <Link to="/stagiaires" className={linkClass("/stagiaires")}>
          Stagiaires
          {location.pathname === "/stagiaires" && (
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-red-600 rounded"></span>
          )}
        </Link>

        <Link to="/documents" className={linkClass("/documents")}>
          Documents
          {location.pathname === "/documents" && (
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-red-600 rounded"></span>
          )}
        </Link>

      </div>

      {/* RIGHT */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location = "/";
        }}
        className="bg-red-600 text-white px-3 md:px-5 py-1 md:py-2 text-xs md:text-base rounded-xl shadow hover:bg-red-700 transition"
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;