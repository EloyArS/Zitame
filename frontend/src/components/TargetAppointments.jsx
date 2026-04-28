import { useState, useEffect } from "react";

function AppointmentsComponent() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
          return;
        }
        setAppointments(data);
      } catch (error) {
        setError("Error al conectar con el servidor");
      }
    };
    fetchAppointments();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      setAppointments(
        appointments.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch (error) {
      setError("Error al actualizar la cita");
    }
  };

  const handleDelete = async (id) => {
    console.log("Intentando borrar la cita con ID:", id);
    console.log("URL de la petición:", `/api/appointments/${id}`);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo eliminar la cita");
        return;
      }
      setAppointments(appointments.filter((a) => a.id !== id));
    } catch (error) {
      setError("Error al intentar conectar con el servidor");
    }
  };

  //Buscador para filtrar por nombre o teléfono.

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm),
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Citas recibidas</h2>
      {/* Buscador */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">No hay citas pendientes</p>
      ) : (
        <div className="appointments-bloques">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-id">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{appointment.customer_name}</p>

                  {/* Añadimos la funcionalidad de whatsap en el apartado del teléfono */}
                  <div className="flex items-center gap-3">
                    <p className="text-gray-600">{appointment.phone}</p>
                    <a
                      href={`https://wa.me/${appointment.phone.replace(/\s+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-600 transition-colors"
                      title="Contactar por WhatsApp"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.411-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  </div>
                  <p className="text-gray-600">{appointment.service_name}</p>
                  <p className="text-gray-600">
                    {new Date(appointment.date_time).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`text-center px-3 py-1 rounded text-sm ${
                      appointment.status === "Aprobado"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "Rechazado"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  {appointment.status === "Pendiente" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatus(appointment.id, "Aprobado")}
                        className="button-aceptar"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() =>
                          handleStatus(appointment.id, "Rechazado")
                        }
                        className="button-rechazar"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="button-eliminar-cerrarsesion"
                  >
                    Eliminar registro
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsComponent;
