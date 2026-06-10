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
        <div>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
}

export default Login;