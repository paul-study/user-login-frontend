import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import BankingDashboard from './components/BankingDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login 
          onSwitchToRegister={switchToRegister}
          onLogin={handleLogin}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onSwitchToLogin={switchToLogin}
          onRegister={handleRegister}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <BankingDashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
