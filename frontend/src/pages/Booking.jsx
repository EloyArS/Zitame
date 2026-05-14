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
  const [date_time] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [occupiedAppointments, setOccupiedAppointments] = useState([]);

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

  //recogemos en una funcion los días y horas ocupados
  useEffect(() => {
    const fetchOccupiedAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments/`);
        const data = await response.json();
        //guardamos solo las fechas
        const occupied = data.map((cita) =>
          //de la bd traemos la fecha con un T entre la fecha y la hora, debemos quitarla para hacer correctamente la comparacion.
          cita.date_time.replace("T", " ").slice(0, 19),
        );
        setOccupiedAppointments(occupied);
      } catch (error) {
        console.error("Error al cargar las citas ocupadas:", error);
      }
    };
    fetchOccupiedAppointments();
  }, []);

  //DIAS
  //obtenemos el día actual y los próximos 14 días, excluyendo fines de semana.
  const showdays = (diasMostrados) => {
    //array con los días disponibles
    const avaliabledays = [];
    const hoy = new Date();
    //if para comprobar que si entramos despues de las 17:00, el día actual se le suma 1
    if (hoy.getHours() > 17 || hoy.getHours() === 17) {
      hoy.setDate(hoy.getDate() + 1);
    }
    //while para recorrer los días hasta los 14 indicados.
    while (avaliabledays.length < diasMostrados) {
      const diaSemana = hoy.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) {
        //ya no trabajamos con toISO, sino con los objetos Date de JS, por lo que obtenemos el año, mes y día con los métodos correspondientes.
        const año = hoy.getFullYear();
        const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
        const dia = hoy.getDate().toString().padStart(2, "0");

        const value = `${año}-${mes}-${dia}`;
        //convertimos el día a un formato legible para el usuario
        const label = hoy.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        avaliabledays.push({ value, label });
      }
      hoy.setDate(hoy.getDate() + 1);
    }
    return avaliabledays;
  };
  //diasamostror será el valor mapeado en el return.
  const diasamostrar = showdays(14);
  console.log(diasamostrar);

  //HORAS
  //Obtenermos las horas con las limitaciones en el horarrio, teniendo en cuentas las ocupadas.
  const showhours = (
    selectedDate,
    occupiedAppointments = [],
    start = "08:00",
    end = "19:00",
    step = 30,
  ) => {
    //si no hay fecha selccionada no tiene por qué cargar aun.
    if (!selectedDate) return [];
    const hours = [];
    const [startHour] = start.split(":").map(Number);
    const [endHour] = end.split(":").map(Number);
    let tiempoactual = new Date();
    tiempoactual.setHours(startHour, 0, 0);
    let tiempofinal = new Date();
    tiempofinal.setHours(endHour, 0, 0);
    //con un while recorremos el tiempo actual hasta el tiempo final saltando la franja de 13:00 a 16:00
    while (tiempoactual <= tiempofinal) {
      const hora = tiempoactual.getHours();
      const minuto = tiempoactual.getMinutes();
      //cambiamos el formato de la hora
      const horaTexto = `${hora.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`;
      const referenciaCita = `${selectedDate} ${horaTexto}:00`;
      //booleano con el que comprobamos si la hora está ocupada dentro de "occupiedAppointments" comparando con referenciaCita
      const citaOcupada = occupiedAppointments.includes(referenciaCita);
      console.log(`Hora: ${horaTexto}, Ocupada: ${citaOcupada}`);
      //si la hora es menor a 13 o mayor o igual a 16 y no está ocupada, la añadimos al array de horas disponibles.
      if ((hora < 13 || hora >= 16) && !citaOcupada) {
        hours.push(horaTexto);
      }
      tiempoactual.setMinutes(tiempoactual.getMinutes() + step);
    }
    return hours;
  };
  //horasDisponibles será el valor mapeado en el return.
  const horasDisponibles = showhours(selectedDate, occupiedAppointments);
  console.log(horasDisponibles);

  //GRABAMOS LA CITA
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
          date_time: `${selectedDate} ${selectedHour}:00`,
          serviceId: selectedService,
          userId,
        }),
      });
      console.log(date_time);
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
              <div className="mb-4 space-y-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Selecciona un servicio
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Elige un servicio</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration} min) - {s.price}€
                    </option>
                  ))}
                </select>
                {/* Selector de fecha */}
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Selecciona una fecha
                </label>
                <select
                  required={true}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Elige una fecha</option>
                  {diasamostrar.map((dia) => (
                    <option key={dia.value} value={dia.value}>
                      {dia.label}
                    </option>
                  ))}
                </select>
                {/* Selector de hora */}
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Selecciona una hora
                </label>
                <select
                  required={true}
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Elige una hora</option>
                  {horasDisponibles.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              {/*InputField Reutilizable */}

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
