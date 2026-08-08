import { Link } from "react-router-dom";
import { LINKS } from "../../config";

const FAQS = [
  {
    q: "Does StudyLock delete my games or files?",
    a: "No. During a focus session StudyLock only closes the apps and sites you've chosen to block. Everything stays installed and comes back when the session ends or your homework is done.",
  },
  {
    q: "How does a session end early?",
    a: "Finish the homework you flagged. Once those tasks are marked done (with a quick proof-of-work note), your distractions unlock even if the timer is still running.",
  },
  {
    q: "What if I need to unlock something urgently?",
    a: "Password protection makes quitting a session deliberate rather than impulsive. You set the rules for how hard it is to stop early.",
  },
  {
    q: "Which browsers are supported?",
    a: "Any Chromium browser through the Chrome Web Store (Chrome, Brave, Arc) and Microsoft Edge through Edge Add-ons. Pair the extension with your account to sync blocklists.",
  },
  {
    q: "Can I use it on more than one computer?",
    a: "Yes. Sign in on each device and your tasks, schedules, and blocklists stay in sync through your account.",
  },
];

export default function Help() {
  return (
    <section className="prose">
      <span className="eyebrow">Help &amp; support</span>
      <h1>How can we help?</h1>
      <p className="lede">Answers to the questions students ask most. Still stuck? Reach out any time.</p>

      {FAQS.map((f) => (
        <details className="faq" key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}

      <h2>Get started</h2>
      <ul>
        <li><Link to="/download">Download the Windows app</Link></li>
        <li><Link to="/extension">Install the browser extension</Link></li>
        <li><Link to="/signup">Create an account</Link></li>
      </ul>

      <h2>Contact us</h2>
      <p>
        Email <a href={`mailto:${LINKS.supportEmail}`}>{LINKS.supportEmail}</a> and we'll get back to you.
        For account or data questions, see our <Link to="/privacy">privacy page</Link>.
      </p>
    </section>
  );
}
