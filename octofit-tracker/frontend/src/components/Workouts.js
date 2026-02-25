import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Workouts: error fetching data', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const durationLabel = (duration) => {
    if (duration <= 30) return { text: 'Quick', cls: 'bg-success' };
    if (duration <= 60) return { text: 'Moderate', cls: 'bg-warning text-dark' };
    return { text: 'Intense', cls: 'bg-danger' };
  };

  return (
    <div className="component-card card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">💪 Workouts</h2>
        <span className="badge bg-light text-dark fs-6">{workouts.length} routines</span>
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
            <p className="mt-2 text-muted">Loading workouts...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table octofit-table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Workout Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Level</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No workouts found.</td>
                  </tr>
                ) : (
                  workouts.map((workout, index) => {
                    const level = durationLabel(workout.duration);
                    return (
                      <tr key={workout.id}>
                        <td className="text-muted">{index + 1}</td>
                        <td><span className="fw-semibold">{workout.name}</span></td>
                        <td className="text-muted" style={{ maxWidth: '280px' }}>{workout.description}</td>
                        <td>
                          <span className="badge bg-info text-dark">{workout.duration} min</span>
                        </td>
                        <td>
                          <span className={`badge ${level.cls}`}>{level.text}</span>
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

export default Workouts;

