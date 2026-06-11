import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);

            const userRes = await axios.get('http://127.0.0.1:8000/auth/get_auth_id/', {
                headers: { Authorization: `Token ${response.data.token}` }
            });
            const userId = userRes.data;

            const userDetail = await axios.get(`http://127.0.0.1:8000/users_router/${userId}/`, {
                headers: { Authorization: `Token ${response.data.token}` }
            });
            localStorage.setItem('isAdmin', userDetail.data.is_admin);

            if (userDetail.data.is_admin) {
                window.location.href = '/admin';
            } else {
                window.location.href = '/doctors';
            }
        } catch (err) {
            console.log(err);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4">
                <div className="card shadow">
                    <div className="card-body p-4">
                        <h2 className="card-title text-center mb-4">Login</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleLogin}>
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
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <p className="text-center mt-3">Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;