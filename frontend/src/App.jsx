import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Account from './components/Account'; // Ensure Account is imported
import { ReactTyped } from "react-typed"; 

function App() {
  const [token, setToken] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [view, setView] = useState('dashboard'); // State to track 'dashboard' vs 'account'

  // 1. If Logged In -> Show Header with Navigation
  if (token) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          {/* Logo - Click to go Home */}
          <h1 
            onClick={() => setView('dashboard')}
            style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              background: 'linear-gradient(to right, #646cff, #9f9eff)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer' 
            }}>
            CourseMinds
          </h1>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
                onClick={() => setView('dashboard')} 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: view === 'dashboard' ? 'white' : '#888', // Highlight if active
                    fontWeight: view === 'dashboard' ? 'bold' : 'normal',
                    fontSize: '1rem'
                }}>
                Home
            </button>
            
            <button 
                onClick={() => setView('account')} 
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: view === 'account' ? 'white' : '#888', // Highlight if active
                    fontWeight: view === 'account' ? 'bold' : 'normal',
                    fontSize: '1rem'
                }}>
                Profile
            </button>

            <button 
                onClick={() => setToken('')} 
                style={{ 
                    padding: '8px 16px', 
                    background: 'transparent', 
                    border: '1px solid #666', 
                    color: 'white', 
                    borderRadius: '6px', 
                    marginLeft: '10px'
                }}>
                Logout
            </button>
          </div>
        </header>

        {/* 2. View Switcher Logic */}
        {view === 'dashboard' ? (
            <Dashboard token={token} />
        ) : (
            <Account token={token} />
        )}
        
      </div>
    );
  }

  // 3. If NOT Logged In (Your exact typing effect)
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center', marginTop: '50px' }}>
      
      <div style={{ marginBottom: '-50px', minHeight: '50px' }}>
        <h1 style={{ 
             fontSize: '5.5rem', 
             fontWeight: '900', 
             fontFamily: "'Fira Code', monospace",
             margin: 0 
           }}>
           <span style={{ color: '#646cff'}}>&gt; </span>
           <ReactTyped
             strings={[
                 'Learn AI',
                 'Build Future',
                 'CourseMinds.'
             ]}
             typeSpeed={100}
             backSpeed={50}
             loop={false}
             onComplete={(self) => {self.cursor.style.display = 'none';}}
             style={{ 
                background: 'linear-gradient(to right, #646cff, #9f9eff)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
             }}
           />
        </h1>
      </div>

      {showLogin ? (
        <Login setToken={setToken} setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
      
    </div>
  );
}

export default App;