import React , { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setShowLogin }) => {
    const [formData, setFormData] = useState({username: '', password: ''});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/auth/login', formData);
            setMessage('Login Successful');
            setToken(res.data.token);
            console.log("Server Response:", res.data);
        }
        catch (error) {
            setMessage('Login Failed. Check credentials.');
            console.error(error);
        }
    };
    return(
        <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '50px'}}>
            <h2>Login</h2>

            {/* The Form UI*/}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username} //conncet input to the state(two-way binding)
                        onChange={handleChange}
                        style={{width:'100%', padding:'8px'}}
                    />
                </div>
                <div style={{marginBotto: '10px'}}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{width: '100%', padding:'8px'}}
                    />
                </div>
                <button type="submit" style={{width:'100%', padding:'10px'}}>
                    Login
                </button>
            </form>
            {/* Conditional Rendering: Only show message if it exists */}
            {message && <p>{message}</p>}

            {/* 2. PASTE YOUR NEW CODE HERE */}
            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                New here? <br/>
                <button
                    onClick={() => setShowLogin(false)}
                    style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                    Create an account
                </button>
            </p>
        
        </div>
    );
};

export default Login;