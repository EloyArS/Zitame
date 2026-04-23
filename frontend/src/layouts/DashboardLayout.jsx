import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  // Constante para controlar el menu del movil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Cerramos menú al hacer click en un enlace.
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Menú Lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600">Zitame</h2>
          {/* Botón para cerrar en móvil */}
          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="dashboard-lesft-sidebar">
          {["/dashboard", "/services", "/sharebooking"].map((path, idx) => {
            const labels = [
              "Panel Principal",
              "Mis Servicios",
              "Enlace para clientes",
            ];
            return (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className="dashboard-lesft-sidebar-content"
              >
                {labels[idx]}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t">
          <button
            onClick={handleLogout}
            className="button-eliminar-cerrarsesion"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Cerramos el menú al tocar fuera (móvil) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar Superior */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          {/* Botón Hamburguesa - Solo visible en móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600 md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-gray-800">Zitame</h1>

          <div className="ml-auto flex items-center gap-4 text-sm text-gray-500 italic">
            Panel de Control
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
