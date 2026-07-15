import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorList from './pages/DoctorList';
import Appointments from './pages/Appointments';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/doctors" element={token ? <DoctorList /> : <Navigate to="/login" />} />
                    <Route path="/appointments" element={token ? <Appointments /> : <Navigate to="/login" />} />
                    <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
                    <Route path="/doctor-dashboard" element={token ? <DoctorDashboard /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;