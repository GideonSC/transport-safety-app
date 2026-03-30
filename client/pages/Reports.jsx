import { useFetchReports } from '../hooks/useFetchReports';
import IncidentList from '../components/IncidentList';
import IncidentMap from '../components/IncidentMap';

export default function Reports() {
  const { reports, loading, error } = useFetchReports();

  return (
    <section>
      <div className="card">
        <h2>Incident Reports</h2>
        <p>View the latest safety reports submitted through the mobile reporting interface.</p>
      </div>
      {loading && <p>Loading reports...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && reports?.length > 0 && <IncidentMap reports={reports} />}
      <IncidentList reports={reports} />
    </section>
  );
}
