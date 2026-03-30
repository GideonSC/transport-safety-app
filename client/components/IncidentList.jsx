export default function IncidentList({ reports }) {
  if (!reports?.length) {
    return <p className="card">No reports available yet.</p>;
  }

  return (
    <section className="card">
      <h2>Recent Safety Reports</h2>
      <ul className="report-list">
        {reports.map((report) => {
          const location = report.locationName || report.location || 'Unknown location';
          const incidentType = report.incidentType || report.severity || 'Incident';
          const status = report.status || 'Pending';

          return (
            <li key={report._id}>
              <div className="report-header">
                <strong>{location}</strong>
                <span className="status-pill">{status}</span>
              </div>
              <p className="report-type">{incidentType}</p>
              <p>{report.description}</p>
              <small>{new Date(report.createdAt).toLocaleString()}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
