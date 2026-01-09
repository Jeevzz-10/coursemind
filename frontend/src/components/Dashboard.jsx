import React, { useState } from 'react';
import axios from 'axios';
import { ReactTyped } from 'react-typed';

const Dashboard = ({ token }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get(`http://localhost:3000/api/recommend?q=${query}`, config);
            setResults(res.data);
            console.log("Courses Found:", res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ 
                    fontSize: '4.5rem', 
                    fontWeight: '900', 
                    fontFamily: "'Fira Code', monospace", 
                    marginBottom: '20px'
                }}>
                    <span style={{ color: 'var(--primary)', marginRight: '10px' }}>&gt;</span>
                    
                    <span style={{ 
                        background: 'linear-gradient(to right, #646cff, #9f9eff)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                    }}>
                        <ReactTyped
                            strings={[
                                'COURSEMINDS AI',
                            ]}
                            typeSpeed={150}
                            loop={false}
                            onComplete={(self) => {self.cursor.style.display = 'none';}}
                        />
                    </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', marginTop: '0' }}>
                    Discover your personalized learning path
                </p>
            </header>

            {/* ... Rest of your code stays exactly the same ... */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
                <input 
                    type="text" 
                    placeholder="What do you want to learn? (e.g. Neural Networks)" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}
                />
                <button 
                    type="submit" 
                    style={{ 
                        padding: '0 30px', 
                        fontSize: '1rem', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: 'bold' 
                    }}>
                    Search
                </button>
            </form>

            {loading && <p style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '1.2rem' }}>🧠 AI is thinking...</p>}
            {error && <p style={{ color: '#ff4444', textAlign: 'center' }}>{error}</p>}

            <div className="course-grid">
                {results.map((course) => (
                    <div key={course.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                             <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                                 Course
                             </span>
                             {course.provider && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.provider}</span>}
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', lineHeight: '1.3' }}>{course.title}</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>{course.description}</p>
                        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {course.tags.map(tag => (
                                <span key={tag} style={{ 
                                    background: 'rgba(100, 108, 255, 0.1)', 
                                    color: 'var(--primary)', 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.85rem' 
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {!loading && results.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
                    <p>Start by typing a topic above to activate the engine.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;