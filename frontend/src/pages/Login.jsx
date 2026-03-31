import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email); // Para debug
    setError("");

    try {
      const response = await fetch("/api/users/login", {
        // Ruta de LOGIN
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Login no lleva 'name'
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Credenciales incorrectas");
        return;
      }

      // Guardamos el token y entramos al panel
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en fetch:", error);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
        Zitame
      </h1>
      <h2 className="text-lg text-gray-600 text-center mb-6">
        ¡Bienvenido de nuevo!
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors shadow-sm mt-2"
        >
          Iniciar Sesión
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600 text-sm">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-bold hover:underline"
        >
          Regístrate ahora
        </Link>
      </p>
    </>
  );
}

export default Login;
