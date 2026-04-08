import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Services from "./pages/Services.jsx";
import Booking from "./pages/Booking.jsx";
import ShareBooking from "./pages/ShareBooking.jsx";
import AppointmentsPage from "./pages/Appointments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Login/Register */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Rutas Protegidas (Panel de control) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/sharebooking" element={<ShareBooking />} />
        </Route>

        <Route path="/booking/:userId" element={<Booking />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
