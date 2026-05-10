import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  // Constante para controlar el menu del movil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const killcookie = async () => {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/login");
      }
    };
    killcookie();
  };

  //Guardamos tema en local storage
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Función para boton de cambiar tema
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  //función para nombre en la parte superior
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const IDinmenu = async () => {
      try {
        const response = await fetch("/api/users/username", {
          method: "GET",
          credentials: "include",
        });
        const userData = await response.json();
        if (response.ok) {
          setUserName(userData.name);
          console.log("Nombre de usuario obtenido:", userData.name);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    IDinmenu();
  }, []);

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
        <div className="p-6 flex justify-between items-center dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-white">
            Zitame
          </h2>
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
        {/*Menú lateral*/}
        <nav className="dashboard-lesft-sidebar dark:bg-gray-800 dark:text-white flex-1 flex flex-col">
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

        <div className="p-8 border-t dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden dark:bg-gray-900 dark:bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden dark:bg-gray-900">
        {/* Navbar Superior */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center dark:bg-gray-800 dark:text-white">
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

          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {userName ? `Bienvenido, ${userName}` : "Cargando..."}
          </h1>
          <div className="mx-auto flex items-center gap-4 text-sm text-gray-500 italic">
            <div className="ml-auto flex items-center gap-4 text-sm text-gray-500 italic hidden md:flex">
              Panel de Control
            </div>
          </div>
          <button onClick={toggleTheme} className="button-tema">
            Cambiar Tema
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
