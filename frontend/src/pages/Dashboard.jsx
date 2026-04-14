import AppointmentsComponent from "../components/TargetAppointments.jsx";
import Calendar from "../components/calendar.jsx";

function Dashboard() {
  return (
    <div>
      {/* --- CALENDARIO --- */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-700">
          Calendario de Citas
        </h2>
        <Calendar />
      </div>

      {/* --- GESTIÓN DE CITAS --- */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-gray-700">
          Listado Detallado
        </h2>
        <AppointmentsComponent />
      </div>
    </div>
  );
}

export default Dashboard;
