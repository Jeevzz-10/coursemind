import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = ({ token }) => {
    const [user, setUser] = useState(null);
    const [newTag, setNewTag] = useState('');
    const [message, setMessage] = useState('');

    // Load User Data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:3000/auth/me', config);
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, [token]);

    // Handle Adding a Tag
    const addInterest = async () => {
        if (!newTag) return;
        const updatedInterests = [...user.interests, newTag];
        
        try {
            const config = { headers: { 'x-auth-token': token } };
            // Send new list to backend
            await axios.put('http://localhost:3000/auth/interests', { interests: updatedInterests }, config);
            
            // Update local state UI
            setUser({ ...user, interests: updatedInterests });
            setNewTag('');
            setMessage('Interests updated!');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    // Handle Removing a Tag
    const removeInterest = async (tagToRemove) => {
        const updatedInterests = user.interests.filter(tag => tag !== tagToRemove);
        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.put('http://localhost:3000/auth/interests', { interests: updatedInterests }, config);
            setUser({ ...user, interests: updatedInterests });
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <p style={{textAlign:'center', color:'white'}}>Loading Profile...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
            <div className="glass-card" style={{ padding: '40px' }}>
                <h2 style={{ 
                    textAlign: 'center', 
                    fontSize: '2.5rem', 
                    marginBottom: '10px',
                    background: 'linear-gradient(to right, #646cff, #9f9eff)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                }}>
                    My Profile
                </h2>
                <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
                    Welcome, <strong>{user.username}</strong>
                </p>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: 'white', marginBottom: '15px' }}>My Interests</h3>
                    <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>
                        Add topics you like (e.g. "python", "data"). The AI will use this to learn about you.
                    </p>
                    
                    {/* Add Tag Input */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            value={newTag} 
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add interest..."
                            style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.3)' }}
                        />
                        <button 
                            onClick={addInterest}
                            style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px' }}>
                            Add
                        </button>
                    </div>

                    {/* Display Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {user.interests.map((tag, index) => (
                            <span key={index} style={{ 
                                background: 'rgba(100, 108, 255, 0.2)', 
                                color: '#fff', 
                                padding: '8px 16px', 
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {tag}
                                <button 
                                    onClick={() => removeInterest(tag)}
                                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}>
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                    {message && <p style={{ color: '#4caf50', marginTop: '10px' }}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Account;