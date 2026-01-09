import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Mappings from "./pages/Mappings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("access"));

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuth(false);
  }

  return (
    <div className="app">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/mappings">Mappings</Link>

        {!isAuth ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>

      <main className="container">
        <Routes>
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/register" element={<Register setIsAuth={setIsAuth} />} />

          <Route path="/patients" element={<ProtectedRoute><Patients/></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors/></ProtectedRoute>} />
          <Route path="/mappings" element={<ProtectedRoute><Mappings/></ProtectedRoute>} />

          <Route path="/" element={<div>Healthcare Frontend — select a page.</div>} />
        </Routes>
      </main>
    </div>
  );
}
