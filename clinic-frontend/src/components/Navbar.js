import React from 'react';

function Navbar() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    return (
        <nav>
            <span>Piki Ora Medical Centre</span>
            {token && (
                <span>
                    &nbsp;| &nbsp;
                    <a href="/doctors">Doctors</a> &nbsp;|&nbsp;
                    <a href="/appointments">My Appointments</a> &nbsp;|&nbsp;
                    <a href="/admin">Admin</a> &nbsp;|&nbsp;
                    <span>Hi, {username}</span> &nbsp;|&nbsp;
                    <button onClick={handleLogout}>Logout</button>
                </span>
            )}
        </nav>
    );
}

export default Navbar;