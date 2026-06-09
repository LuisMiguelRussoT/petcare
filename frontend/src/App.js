import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>🐾 ReWow Pet Care System</h1>
      </nav>
      <Login onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default App;
