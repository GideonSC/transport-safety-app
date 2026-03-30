import ReportForm from '../components/ReportForm';

export default function Home() {
  return (
    <section>
      <div className="hero-card card">
        <p className="eyebrow">Trusted safety reporting</p>
        <h2>Keep your commute safer with instant incident reporting</h2>
        <p>
          Submit reports with GPS accuracy, add optional photos, and track the status of safety issues across public transit.
          This platform helps riders and operations teams respond faster and keep every route more secure.
        </p>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h3>Fast, mobile-first reporting</h3>
          <p>Log issues in seconds from your phone and share clear details that help safety teams act immediately.</p>
        </article>
        <article className="feature-card">
          <h3>Real-time incident visibility</h3>
          <p>See active reports on a map and stay aware of nearby hazards and transit conditions.</p>
        </article>
        <article className="feature-card">
          <h3>Secure, trusted platform</h3>
          <p>Built with secure login, backend validation, and a smooth review workflow for transit operators.</p>
        </article>
      </div>

      <div className="card">
        <h2>How it helps riders and operators</h2>
        <ul className="steps-list">
          <li>Register or log in quickly with secure authentication.</li>
          <li>Report safety incidents with location, text, and optional images.</li>
          <li>Review recent reports and browse incident history anytime.</li>
        </ul>
      </div>

      <ReportForm />
    </section>
  );
}
