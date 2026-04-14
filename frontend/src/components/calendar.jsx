import { useState, useEffect } from "react";

function Calendar() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  //Cambio de semana
  const changeWeek = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setDate(viewDate.getDate() + offset * 7);
    setViewDate(newDate); // Aquí es donde finalmente usas setViewDate
  };
  const goToToday = () => {
    setViewDate(new Date());
  };

  // --- LÓGICA DE CALENDARIO ---
  const [viewDate, setViewDate] = useState(new Date());
  const getMonday = (d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };
  const monday = getMonday(viewDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 capitalize">
        Calendario de Citas -{" "}
        {viewDate.toLocaleString("es", { month: "long", year: "numeric" })}
      </h1>

      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

      {/* Controles de navegacion semana */}

      <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
          >
            Volver a Semana actual
          </button>

          <button
            onClick={() => changeWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors border text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <span className="text-sm font-medium text-gray-500 hidden sm:block">
          Vista Semanal
        </span>
      </div>

      {/* --- SECCIÓN CALENDARIO --- */}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-10">
        <div className="flex flex-col md:grid md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {weekDays.map((date) => {
            const dayNum = date.getDate();
            const dayName = date.toLocaleDateString("es", { weekday: "short" });

            // Filtrar citas para este día concreto
            const dayAppointments = appointments.filter((app) => {
              const appDate = new Date(app.date_time);
              return (
                appDate.getDate() === dayNum &&
                appDate.getMonth() === date.getMonth() &&
                appDate.getFullYear() === date.getFullYear()
              );
            });

            return (
              <div
                key={date.toString()}
                className="flex md:flex-col min-h-[100px] md:min-h-[300px] hover:bg-gray-50/50 transition-colors"
              >
                {/* Cabecera del día */}
                <div className="w-24 md:w-full bg-gray-50/80 p-4 flex flex-col justify-center items-center border-r md:border-r-0 md:border-b border-gray-100">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {dayName}
                  </span>
                  <span className="text-2xl font-black text-gray-800">
                    {dayNum}
                  </span>
                </div>

                {/* Listado de Citas */}
                <div className="flex-1 p-3 space-y-2">
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map((app) => (
                      <div
                        key={app.id}
                        className={`p-2 rounded-lg text-white shadow-sm transition-all hover:scale-[1.02] ${
                          app.status === "approved"
                            ? "bg-green-500"
                            : app.status === "rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-[11px] md:text-[10px] font-bold truncate">
                            {app.customer_name}
                          </span>
                          <span className="text-[11px] md:text-[10px] font-bold truncate">
                            {app.service_name}
                          </span>
                          <span className="text-[9px] font-medium opacity-90">
                            {new Date(app.date_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-[10px] text-gray-300 font-medium italic">
                        Libre
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Calendar;
