import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Leaderboard: error fetching data', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const maxScore = entries.length > 0 ? Math.max(...entries.map(e => e.score)) : 1;

  const rankClass = (index) => {
    if (index === 0) return 'rank-badge rank-1';
    if (index === 1) return 'rank-badge rank-2';
    if (index === 2) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  return (
    <div className="component-card card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">🏆 Leaderboard</h2>
        <span className="badge bg-light text-dark fs-6">{entries.length} athletes</span>
      </div>
      <div className="card-body p-0">
        {error && (
          <div className="alert alert-danger m-3">
            <strong>Error:</strong> {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table octofit-table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Team</th>
                  <th scope="col">Score</th>
                  <th scope="col">Calories</th>
                  <th scope="col" style={{ minWidth: '160px' }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No entries found.</td>
                  </tr>
                ) : (
                  entries.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>
                        <span className={rankClass(index)}>{index + 1}</span>
                      </td>
                      <td><span className="fw-semibold">{entry.user}</span></td>
                      <td>
                        <span className={`badge ${entry.team === 'Team Marvel' ? 'bg-danger' : 'bg-primary'}`}>
                          {entry.team || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-primary">{entry.score}</span>
                      </td>
                      <td>
                        <span className="fw-semibold text-warning">🔥 {entry.calories != null ? entry.calories.toLocaleString() : 0}</span>
                      </td>
                      <td>
                        <div className="score-bar-container">
                          <div className="score-bar">
                            <div
                              className="score-bar-fill"
                              style={{ width: `${(entry.score / maxScore) * 100}%` }}
                            />
                          </div>
                          <small className="text-muted">{Math.round((entry.score / maxScore) * 100)}%</small>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;

