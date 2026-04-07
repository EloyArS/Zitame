import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function ShareBooking() {
  // 1. Creamos un estado para el ID del usuario
  const [userId, setUserId] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUserIdFromToken = (jwt) => {
      try {
        if (!jwt) return null;
        const base64Url = jwt.split(".")[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const decoded = JSON.parse(jsonPayload);
        // Buscamos 'id' o 'userId' por si acaso
        return decoded.id || decoded.userId;
      } catch (error) {
        console.error("Error al leer el token:", error);
        return null;
      }
    };

    // 2. Ejecutamos la extracción y guardamos en el estado
    const idEncontrado = getUserIdFromToken(token);
    setUserId(idEncontrado);
    setCargando(false);
  }, []);

  // 3. Mientras procesa, no mostramos nada o un spinner
  if (cargando)
    return <div className="p-10 text-center text-gray-500">Cargando...</div>;

  const bookingUrl = `${window.location.origin}/booking/${userId}`;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-10 bg-gray-100 rounded-xl shadow-lg border">
      {" "}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Tu QR de Reservas
      </h2>
      {userId ? (
        <div className="flex flex-col items-center">
          <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
            <QRCodeSVG value={bookingUrl} size={500} />
          </div>
          <p className="mt-6 text-sm font-medium text-gray-400 uppercase tracking-widest">
            Enlace de reserva:
          </p>
          <code className="mt-2 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded">
            {bookingUrl}
          </code>
        </div>
      ) : (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg text-center">
          <p>No se pudo identificar tu usuario.</p>
          <p className="text-sm mt-2 font-semibold">
            Por favor,{" "}
            <a href="/login" className="underline">
              inicia sesión
            </a>{" "}
            nuevamente.
          </p>
        </div>
      )}
    </div>
  );
}
