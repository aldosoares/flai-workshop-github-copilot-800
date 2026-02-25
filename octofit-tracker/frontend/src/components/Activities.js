import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Activities: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
        setLoading(false);
      })
      .catch(err => {
        console.error('Activities: error fetching data', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  const activityIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('run') || t.includes('speed')) return '🏃';
    if (t.includes('fly') || t.includes('iron')) return '🦸';
    if (t.includes('hammer') || t.includes('strength')) return '🔨';
    if (t.includes('martial') || t.includes('condi')) return '🥋';
    if (t.includes('lasso') || t.includes('warrior')) return '⚡';
    if (t.includes('shield') || t.includes('throw')) return '🛡️';
    return '💪';
  };

  return (
    <div className="component-card card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">🏃 Activities</h2>
        <span className="badge bg-light text-dark fs-6">{activities.length} logged</span>
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
            <p className="mt-2 text-muted">Loading activities...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table octofit-table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User</th>
                  <th scope="col">Activity</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No activities found.</td>
                  </tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr key={activity.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td><span className="fw-semibold">{activity.user}</span></td>
                      <td>
                        <span className="me-2">{activityIcon(activity.activity_type)}</span>
                        {activity.activity_type}
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {activity.duration} min
                        </span>
                      </td>
                      <td className="text-muted">{formatDate(activity.date)}</td>
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

export default Activities;

