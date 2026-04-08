import AppointmentsComponent from "../components/TargetAppointments.jsx";

function AppointmentsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>

      <section className="mt-8">
        <AppointmentsComponent />
      </section>
    </div>
  );
}

export default AppointmentsPage;
