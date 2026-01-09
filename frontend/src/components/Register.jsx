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
      
      setMessage('Registration Successful! Please Login.');
      
      // 2. Wait 2 seconds, then switch user back to Login screen automatically
      setTimeout(() => {
        setShowLogin(true);
      }, 2000);

    } catch (error) {
      setMessage('Registration Failed. Username might be taken.');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '50px' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="username"
            placeholder="Choose Username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            name="password"
            placeholder="Choose Password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none' }}>
          Sign Up
        </button>
      </form>
      
      {message && <p>{message}</p>}
      
      {/* Toggle Button */}
      <p style={{ marginTop: '20px', fontSize: '14px' }}>
        Already have an account? <br/>
        <button 
            onClick={() => setShowLogin(true)} 
            style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
            Login here
        </button>
      </p>
    </div>
  );
};

export default Register;