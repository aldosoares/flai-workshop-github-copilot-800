import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Teams: error fetching data', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  return (
    <div className="component-card card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">🤝 Teams</h2>
        <span className="badge bg-light text-dark fs-6">{teams.length} teams</span>
      </div>
      <div className="card-body p-0">
        {error && (
          <div className="alert alert-danger m-3">
            <strong>Error:</strong> {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading teams...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table octofit-table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Team Name</th>
                  <th scope="col">Members</th>
                  <th scope="col">Size</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No teams found.</td>
                  </tr>
                ) : (
                  teams.map((team, index) => {
                    let members = [];
                    if (Array.isArray(team.members)) {
                      members = team.members;
                    } else if (typeof team.members === 'string' && team.members.trim()) {
                      try {
                        const parsed = JSON.parse(team.members);
                        members = Array.isArray(parsed) ? parsed : [];
                      } catch (e) {
                        members = team.members.split(',').map(m => m.trim()).filter(Boolean);
                      }
                    }
                    return (
                      <tr key={team.id}>
                        <td className="text-muted">{index + 1}</td>
                        <td><span className="fw-semibold">{team.name}</span></td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {members.map((m, i) => (
                              <span key={i} className="badge bg-secondary">{m}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary rounded-pill">{members.length}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;

