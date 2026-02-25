import React, { useState, useEffect, useCallback } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', team: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';
  const teamsUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  const fetchUsers = useCallback(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
    fetch(teamsUrl)
      .then(res => res.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
      })
      .catch(() => {});
  }, [fetchUsers, teamsUrl]);

  const openEdit = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, team: user.team || '' });
    setSaveError(null);
  };

  const closeEdit = () => {
    setEditUser(null);
    setSaveError(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaveError(null);
    fetch(`${apiUrl}${editUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(() => {
        setSaving(false);
        closeEdit();
        fetchUsers();
      })
      .catch(err => {
        setSaveError(err.message);
        setSaving(false);
      });
  };

  return (
    <div className="component-card card mb-4">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">👤 Users</h2>
        <span className="badge bg-light text-dark fs-6">{users.length} members</span>
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
            <p className="mt-2 text-muted">Loading users...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table octofit-table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Team</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No users found.</td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td>
                        <span className="fw-semibold">{user.name}</span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {user.username || user.email.split('@')[0]}
                        </span>
                      </td>
                      <td>
                        <a href={`mailto:${user.email}`} className="text-decoration-none text-primary">
                          {user.email}
                        </a>
                      </td>
                      <td>
                        {user.team ? (
                          <span className={`badge ${user.team === 'Team Marvel' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.team}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => openEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✏️ Edit User — {editUser.name}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} />
              </div>
              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger py-2">
                    <strong>Save failed:</strong> {saveError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                  >
                    <option value="">— No Team —</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

