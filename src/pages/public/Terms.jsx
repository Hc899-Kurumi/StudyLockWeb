import { Link } from "react-router-dom";
import { LINKS } from "../../config";

export default function Terms() {
  return (
    <section className="prose">
      <span className="eyebrow">Legal</span>
      <h1>Terms of Service</h1>
      <p className="updated">Template — replace with your reviewed terms before launch.</p>

      <p>
        These terms are a starting template for StudyLock. Review them with a qualified professional and
        adjust to your jurisdiction and business before launch.
      </p>

      <h2>Using StudyLock</h2>
      <p>
        StudyLock helps you plan work and block distractions. You're responsible for the blocklists,
        schedules, and passwords you set. StudyLock closes selected apps and sites during focus and
        restores them afterward; it does not delete your software or files.
      </p>

      <h2>Your account</h2>
      <p>
        Keep your login credentials secure. You're responsible for activity under your account. You can
        delete your account and data at any time from <Link to="/dashboard/settings">Settings</Link>.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don't use StudyLock to interfere with devices or accounts that aren't yours.</li>
        <li>Don't attempt to disrupt or reverse-engineer the service.</li>
      </ul>

      <h2>Availability</h2>
      <p>
        We aim for reliable service but don't guarantee uninterrupted availability. Features may change
        as the product evolves.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${LINKS.supportEmail}`}>{LINKS.supportEmail}</a>.
        See also our <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </section>
  );
}
