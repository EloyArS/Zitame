import { useState, useEffect } from "react";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  // -CALENDARIO
  const [viewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  // Cálculo de días
  const startDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Arrays para renderizar calendario
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay === 0 ? 6 : startDay - 1 });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
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

  //Aprobación o rechazo de citas.

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

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a)),
        );
      }
    } catch (error) {
      setError("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Panel de Citas -{" "}
        {viewDate.toLocaleString("es", { month: "long", year: "numeric" })}
      </h1>

      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

      {/*Sección calendario*/}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-10">
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-bold text-gray-500 uppercase"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => (
            <div
              key={`b-${i}`}
              className="h-28 bg-gray-50/50 border-b border-r border-gray-100"
            ></div>
          ))}
          {days.map((day) => (
            <div
              key={day}
              className="h-28 border-b border-r border-gray-100 p-2 hover:bg-blue-50/30 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-400">{day}</span>

              <div className="mt-1 space-y-1">
                {appointments
                  .filter((app) => new Date(app.date_time).getDate() === day)
                  .map((app) => (
                    <div
                      key={app.id}
                      className={`text-[10px] p-1 rounded truncate text-white font-bold ${
                        app.status === "approved"
                          ? "bg-green-500"
                          : app.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {app.customer_name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Citas</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 italic">No hay citas para mostrar.</p>
        ) : (
          appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-800">{app.customer_name}</p>
                <p className="text-sm text-gray-600">
                  {app.service_name} —{" "}
                  {new Date(app.date_time).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">{app.phone}</p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : app.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
                {app.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(app.id, "approved")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleStatus(app.id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
