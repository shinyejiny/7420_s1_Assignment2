import React from 'react';

function Navbar() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
            <span className="navbar-brand fw-bold">🏥 Piki Ora Medical Centre</span>
            {token && (
                <div className="d-flex align-items-center gap-3 ms-auto">
                    <a href="/doctors" className="nav-link text-white">Doctors</a>
                    <a href="/appointments" className="nav-link text-white">My Appointments</a>
                    {isAdmin && <a href="/admin" className="nav-link text-white">Admin</a>}
                    <span className="text-white">Hi, {username}</span>
                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Logout</button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;