import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Teams from "./pages/Teams";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/admin/users"
        element={<UserManagement />}
      />
      <Route path="/teams" element={<Teams />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;