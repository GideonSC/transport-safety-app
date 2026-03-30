export default function About() {
  return (
    <section className="card">
      <h2>About the Safety Reporting System</h2>
      <p>
        This platform is built to make public transport safer for riders, drivers, and transit teams.
        It combines fast mobile reporting with GPS location capture, secure backend storage, and offline-ready support.
      </p>
      <div className="feature-grid">
        <article className="feature-card">
          <h3>Built for riders</h3>
          <p>Easy reporting from any device helps people share concerns without friction.</p>
        </article>
        <article className="feature-card">
          <h3>Designed for teams</h3>
          <p>Operators get clean, actionable reports so they can address hazards quickly.</p>
        </article>
        <article className="feature-card">
          <h3>Reliable and secure</h3>
          <p>Protected authentication and stable backend storage keep incident data safe.</p>
        </article>
      </div>
    </section>
  );
}
