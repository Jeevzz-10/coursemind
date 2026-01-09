import React, {useState} from "react";
import axios from "axios";

const Dashboard = ({token}) => {
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
            console.log("Coures Found:", res.data);
        }
        catch (err) {
            console.error(err);
            setError('Failed to fetch recommendtions.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>AI Course Recommender</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="What do you want to learn? (e.g. python, data)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button type="submit" style={{padding: '10px 20px' }}>Search</button>
            </form>

            {/* Loading State */}
            {loading && <p>Asking the AI...</p>}
            {error && <p style={{color:'red'}}>{error}</p>}

            {/* CONCEPT: MAPPING LISTS 
                We loop through the 'results' array and create a card for each course.
            */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {results.map((course) => (
                    <div key={course.id} style={{border:'1px solid #ddd', padding: '15px', borderRadius:'8px'}}>
                        <h3 style={{margin: '0 0 10px 0' }}>{course.title}</h3>
                        <p style={{fontSize: '14px', color: '#555'}}>{course.description}</p>
                        <div style={{marginTop: '10px'}}>
                            {course.tags.map(tag => (
                                <span key={tag} style={{background: '#000', padding: '2px 8px', borderRadius: '4px', marginRight: '5px'}}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* Show message if no results found yet */}
            {!loading && results.length === 0 && <p style={{ color: '#888' }}>Type a topic to get started.</p>}
        </div>
    );
};

export default Dashboard;