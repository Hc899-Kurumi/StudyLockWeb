import { Link } from "react-router-dom";
import { LINKS } from "../../config";

export default function Privacy() {
  return (
    <section className="prose">
      <span className="eyebrow">Legal</span>
      <h1>Privacy Policy</h1>
      <p className="updated">Template — replace with your reviewed policy before launch.</p>

      <p>
        This page explains what StudyLock collects, why, and the choices you have. It's a starting
        template and should be reviewed by a qualified professional before you rely on it.
      </p>

      <h2>What we store</h2>
      <ul>
        <li><strong>Account details</strong> — your name and email, used to sign you in and sync your data.</li>
        <li><strong>Your content</strong> — tasks, schedules, blocklists, and device names you create.</li>
        <li><strong>Device info</strong> — which devices and browsers are paired to your account.</li>
      </ul>
      <p>
        StudyLock does not read the contents of your files or browsing history. Blocking works from the
        lists you define. Blocked apps and sites are closed, never deleted.
      </p>

      <h2>How your data is used</h2>
      <p>
        Your content is used only to run the features you asked for — planning, scheduling, and blocking —
        and to keep them in sync across your devices. We don't sell your data or show ads.
      </p>

      <h2>Where it's kept</h2>
      <p>
        Account and content data are stored in Google Firebase (Authentication and Firestore). Access is
        scoped so only you can read or write your own records.
      </p>

      <h2>Your choices</h2>
      <p>
        You can edit or delete any item at any time from your dashboard. You can permanently delete your
        account and all associated data from <Link to="/dashboard/settings">Settings</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href={`mailto:${LINKS.supportEmail}`}>{LINKS.supportEmail}</a>.
        See also our <Link to="/terms">Terms of Service</Link>.
      </p>
    </section>
  );
}
