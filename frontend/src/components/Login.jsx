import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setShowLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', formData);
      setMessage('Login Successful!');
      setToken(res.data.token); 
    } catch (error) {
      setMessage('Login Failed. Check credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                fontSize: '2rem', 
                marginBottom: '30px',
                background: 'linear-gradient(to right, #646cff, #9f9eff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                LOGIN
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}
                />
                <button type="submit" style={{ 
                    padding: '12px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginTop: '10px'
                }}>
                    Login
                </button>
            </form>
            
            {message && <p style={{ textAlign: 'center', marginTop: '20px', color: message.includes('Failed') ? '#ff4444' : '#4caf50' }}>{message}</p>}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button 
                    onClick={() => setShowLogin(false)} 
                    style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
                    Don't have an account? Create one.
                </button>
            </div>
        </div>
    </div>
  );
};

export default Login;