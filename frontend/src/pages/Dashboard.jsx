import { useState, useEffect } from "react";
import AppointmentsComponent from "../components/TargetAppointments.jsx";

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

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Calendario de Citas -{" "}
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

      {/*Gestion de citas*/}

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

        <section className="mt-8">
          <AppointmentsComponent />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
