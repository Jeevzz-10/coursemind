import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setShowLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send data to the Register Endpoint
      await axios.post('http://localhost:3000/auth/register', formData);
      
      setMessage('Registration Successful! Redirecting to Login...');
      
      // 2. Wait 2 seconds, then switch user back to Login screen automatically
      setTimeout(() => {
        setShowLogin(true);
      }, 2000);

    } catch (error) {
      setMessage('Registration Failed. Username might be taken.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
            
            {/* Header with Gradient Text */}
            <h2 style={{ 
                textAlign: 'center', 
                fontSize: '2rem', 
                marginBottom: '30px',
                background: 'linear-gradient(to right, #646cff, #9f9eff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                CREATE ACCOUNT
            </h2>

            {/* Form Section */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input
                    type="text"
                    name="username"
                    placeholder="Choose Username"
                    value={formData.username}
                    onChange={handleChange}
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.2)' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Choose Password"
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
                    Sign Up
                </button>
            </form>
            
            {/* Status Message */}
            {message && (
                <p style={{ 
                    textAlign: 'center', 
                    marginTop: '20px', 
                    color: message.includes('Failed') ? '#ff4444' : '#4caf50' 
                }}>
                    {message}
                </p>
            )}

            {/* Switch to Login Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button 
                    onClick={() => setShowLogin(true)} 
                    style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
                    Already have an account? Login here.
                </button>
            </div>

        </div>
    </div>
  );
};

export default Register;