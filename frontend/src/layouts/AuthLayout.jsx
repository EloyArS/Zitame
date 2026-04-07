// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Lado Izquierdo: Branding/Imagen (Solo visible en pantallas grandes) */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-12 text-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-extrabold mb-6">Zitame</h1>
          <p className="text-xl text-blue-100">
            Gestiona tus citas desde un único panel, acepta, rechaza y modifica
            con un solo click.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 p-2 rounded-full">✓</span>
              <span>Gestión de servicios personalizada</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 p-2 rounded-full">✓</span>
              <span>Panel de control en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 p-2 rounded-full">✓</span>
              <span>Controla y actualiza tu calendario</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Formulario (Login / Register) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Aquí es donde "caerán" Login.jsx o Register.jsx */}
          <Outlet />

          <footer className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Zitame App. Todos los derechos
            reservados.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
