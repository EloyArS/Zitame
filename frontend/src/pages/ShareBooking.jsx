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
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
          <div className="p-4 sm:p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl w-full max-w-[500px]">
            <QRCodeSVG
              value={bookingUrl}
              size={null}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          <p className="mt-6 text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest text-center">
            Enlace de reserva:
          </p>

          <code className="mt-2 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded break-all text-center text-sm sm:text-base">
            {bookingUrl}
          </code>
        </div>
      ) : (
        <div className="text-amber-600 bg-amber-50 p-6 rounded-lg text-center border border-amber-200">
          <p className="font-bold">Enlace de reserva no válido</p>
          <p className="text-sm mt-2">
            Este enlace parece haber expirado o es incorrecto. Por favor,
            contacta directamente con el establecimiento.
          </p>
        </div>
      )}
    </div>
  );
}
