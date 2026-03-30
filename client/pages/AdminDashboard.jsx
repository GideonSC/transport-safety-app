import { useEffect, useState } from 'react';
import { getAllReports, markReportReviewed } from '../services/api';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllReports();
      setReports(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to fetch reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMarkReviewed = async (reportId) => {
    setUpdatingId(reportId);
    setError('');

    try {
      const response = await markReportReviewed(reportId);
      setReports((prev) => prev.map((report) => (report._id === reportId ? response.data : report)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update report.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <section className="card">
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>User</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Incident Type</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Location</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Date</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                {report.userId?.name || 'Unknown'}
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{report.incidentType}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{report.locationName}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{report.status}</td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                {new Date(report.createdAt).toLocaleString()}
              </td>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                {report.status === 'Pending' ? (
                  <button
                    type="button"
                    onClick={() => handleMarkReviewed(report._id)}
                    disabled={updatingId === report._id}
                    style={{ padding: '0.5rem 0.9rem', borderRadius: '0.5rem', border: 'none', background: '#0b4f6c', color: '#fff', cursor: 'pointer' }}
                  >
                    {updatingId === report._id ? 'Updating...' : 'Mark Reviewed'}
                  </button>
                ) : (
                  <span>Reviewed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
