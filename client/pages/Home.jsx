import ReportForm from '../components/ReportForm';

export default function Home() {
  return (
    <section>
      <div className="card">
        <h2>Public Transport Safety Reporting</h2>
        <p>
          Use this app to report unsafe conditions, suspicious behavior, or emergencies on public transport.
          Reports are forwarded to the safety operations team.
        </p>
      </div>
      <ReportForm />
    </section>
  );
}
