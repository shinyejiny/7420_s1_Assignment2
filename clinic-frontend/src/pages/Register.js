import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://7420-s1-assignment2.vercel.app/register/', {
                username,
                email,
                password,
                is_patient: true,
                is_admin: false
            });
            window.location.href = '/login';
        } catch (err) {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4">
                <div className="card shadow">
                    <div className="card-body p-4">
                        <h2 className="card-title text-center mb-4">Register</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                        <p className="text-center mt-3">Already have an account? <a href="/login">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;