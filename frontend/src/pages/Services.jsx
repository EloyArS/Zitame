import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";

function Services() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await fetch("/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setServices(data);
      } catch (err) {
        setError(err.message || "Error al conectar con el servidor");
      }
    };
    fetchServices();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, duration, price, description }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setServices([...services, data.service]);
      setName("");
      setDuration("");
      setPrice("");
      setDescription("");

      setSuccess("Servicio creado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Error al crear el servicio");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      setError("Error al eliminar el servicio");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mis Servicios</h1>
          <Link
            to="/dashboard"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            ← Volver al panel
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 shadow-sm">
            {success}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Añadir Nuevo Servicio
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <InputField
                label="Nombre del Servicio"
                type="text"
                placeholder="Ej. Corte de pelo caballero"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <InputField
              label="Duración (minutos)"
              type="number"
              placeholder="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <InputField
              label="Precio (€)"
              type="number"
              placeholder="15.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <div className="md:col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                rows="2"
                placeholder="Breve descripción del servicio..."
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-shadow shadow-md"
              >
                + Crear Servicio
              </button>
            </div>
          </form>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Servicios Activos
        </h2>
        <div className="grid gap-4">
          {services.length === 0 ? (
            <p className="text-gray-500 italic">
              No tienes servicios creados todavía.
            </p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {service.name}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {service.duration} min — {service.price}€
                  </p>
                  {service.description && (
                    <p className="text-gray-500 text-sm mt-1">
                      {service.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all font-medium border border-red-100"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Services;
