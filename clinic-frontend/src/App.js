import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorList from './pages/DoctorList';
import Appointments from './pages/Appointments';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctors" element={token ? <DoctorList /> : <Navigate to="/login" />} />
                <Route path="/appointments" element={token ? <Appointments /> : <Navigate to="/login" />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;