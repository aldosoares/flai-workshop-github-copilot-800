import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="welcome-hero text-center">
      <div className="mb-3" style={{ fontSize: '4rem' }}>🐙</div>
      <h1>OctoFit Tracker</h1>
      <p className="lead mt-3 mb-4">
        Track your fitness activities, compete with your team, and stay on top of the leaderboard!
      </p>
      <div className="row justify-content-center g-3 mt-2">
        {[
          { icon: '👤', label: 'Users', path: '/users', color: '#4facfe' },
          { icon: '🏆', label: 'Leaderboard', path: '/leaderboard', color: '#f9ca24' },
          { icon: '🏃', label: 'Activities', path: '/activities', color: '#6ab04c' },
          { icon: '🤝', label: 'Teams', path: '/teams', color: '#e17055' },
          { icon: '💪', label: 'Workouts', path: '/workouts', color: '#a29bfe' },
        ].map(item => (
          <div className="col-6 col-md-2" key={item.label}>
            <NavLink to={item.path} className="text-decoration-none">
              <div className="stat-card card text-center p-3">
                <div className="stat-icon">{item.icon}</div>
                <div className="fw-semibold" style={{ color: item.color }}>{item.label}</div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              🐙 OctoFit Tracker
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {[
                  { to: '/users', label: '👤 Users' },
                  { to: '/teams', label: '🤝 Teams' },
                  { to: '/activities', label: '🏃 Activities' },
                  { to: '/leaderboard', label: '🏆 Leaderboard' },
                  { to: '/workouts', label: '💪 Workouts' },
                ].map(item => (
                  <li className="nav-item" key={item.to}>
                    <NavLink className="nav-link" to={item.to}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="page-content container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>

        <footer className="app-footer text-center mt-5">
          <div className="container">
            <span>🐙 OctoFit Tracker &mdash; Stay fit, stay competitive.</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;


