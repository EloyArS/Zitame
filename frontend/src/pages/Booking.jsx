import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputField from "../components/InputField";

function Booking() {
  const { userId } = useParams();

  // Estados
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar servicios del negocio (público)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/services/public/${userId}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "No se pudieron cargar los servicios");
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          date_time: dateTime,
          serviceId: selectedService,
          userId, // El ID del negocio
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Error al solicitar la cita");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="text-center mt-20">Cargando servicios...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-blue-600">
          Zitame
        </h1>
        <h2 className="text-xl text-center text-gray-600 mb-8">
          Reserva tu cita
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-white p-8 rounded-lg shadow-xl text-center animate-fade-in">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold mb-2">¡Cita solicitada!</h3>
            <p className="text-gray-600 mb-6">
              El establecimiento confirmará tu asistencia en breve.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:underline font-medium"
            >
              Solicitar otra cita
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit}>
              {/* Selector de Servicio */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Selecciona un servicio
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Elige un servicio --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration} min) - {s.price}€
                    </option>
                  ))}
                </select>
              </div>

              {/*InputField Reutilizable */}
              <InputField
                label="Fecha y Hora"
                type="datetime-local"
                value={dateTime}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setDateTime(e.target.value)}
              />

              <InputField
                label="Tu Nombre"
                type="text"
                placeholder="Ej. Marco Polo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <InputField
                label="Teléfono"
                type="tel"
                placeholder="600 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <InputField
                label="Email (opcional)"
                type="email"
                placeholder="tu@email.com"
                value={email}
                required={false}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md mt-4"
              >
                Confirmar Reserva
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
