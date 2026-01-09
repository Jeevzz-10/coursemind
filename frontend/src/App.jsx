import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
  
  const [token, setToken] = useState('');
  const [showLogin, setShowLogin] = useState(true); //new state: true->login, false->register.
  
  // 1. If User is Logged In (Has Token) -> Show Dashboard
  if (token) {
    return (
      <div style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ padding: '20px 0', borderBottom: '1px solid #ccc', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>CourseMinds</h1>
          <button onClick={() => setToken('')} style={{ padding: '5px 10px' }}>Logout</button>
        </header>
        <Dashboard token={token} />
      </div>
    );
  }

  // 2. If User is NOT Logged In -> Show Login OR Register
  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: '50px' }}>
      <h1>CourseMinds</h1>
      
      {showLogin ? (
        <Login setToken={setToken} setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
      
    </div>
  );
}

export default App;