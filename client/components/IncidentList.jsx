export default function IncidentList({ reports }) {
  if (!reports?.length) {
    return <p className="card">No reports available yet.</p>;
  }

  return (
    <section className="card">
      <h2>Recent Safety Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report._id} style={{ marginBottom: '1rem' }}>
            <strong>{report.location}</strong> — {report.severity}
            <p>{report.description}</p>
            <small>{new Date(report.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
