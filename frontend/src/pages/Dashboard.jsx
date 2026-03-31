import { useState, useEffect } from "react";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        const response = await fetch("/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
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
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Panel de citas</h1>
          <div className="flex gap-4">
            <a
              href="/services"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Mis servicios
            </a>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">No hay citas pendientes</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{appointment.customer_name}</p>
                    <p className="text-gray-600">{appointment.phone}</p>
                    <p className="text-gray-600">{appointment.service_name}</p>
                    <p className="text-gray-600">
                      {new Date(appointment.date_time).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`text-center px-3 py-1 rounded text-sm ${
                        appointment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                    {appointment.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatus(appointment.id, "approved")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() =>
                            handleStatus(appointment.id, "rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
