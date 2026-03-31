import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardLayout = () => {
  const navigate = useNavigate();

  // Protección de ruta: Si no hay token, fuera al login
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Menú Lateral */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">Zitame</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/dashboard"
            className="block p-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition-colors"
          >
            Panel Principal
          </Link>
          <Link
            to="/services"
            className="block p-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition-colors"
          >
            Mis Servicios
          </Link>
          <Link
            to="/appointments"
            className="block p-3 rounded-lg hover:bg-blue-50 text-gray-700 font-medium transition-colors"
          >
            Citas Recibidas
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar Superior */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 md:hidden">
            Zitame
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-500 italic">
              Panel de Control
            </span>
          </div>
        </header>

        {/* El "Hueco" para las páginas internas */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
