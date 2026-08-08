import { Link } from "react-router-dom";
import { LINKS, APP_VERSION } from "../../config";
import { Icon } from "../../components/ui";

export default function Download() {
  const ready = LINKS.windowsInstaller !== "#";
  return (
    <section className="content">
      <div className="content-head">
        <span className="eyebrow">Windows app</span>
        <h1>Download StudyLock for Windows</h1>
        <p>The desktop app closes your games and programs during focus, then restores them the moment your work is done.</p>
      </div>

      <div className="dl-card">
        <span className="dl-ico"><Icon name="windows" size={30} /></span>
        <div className="dl-meta">
          <h3>StudyLock for Windows</h3>
          <p className="mono">Version {APP_VERSION} · Windows 10 &amp; 11 · 64-bit</p>
        </div>
        <a
          className="btn btn--primary btn--lg"
          href={LINKS.windowsInstaller}
          {...(ready ? { download: true } : {})}
          aria-disabled={!ready}
        >
          <Icon name="download" size={18} /> Download installer
        </a>
      </div>

      {!ready && (
        <p className="content-note">
          Installer URL not set yet — add VITE_WINDOWS_INSTALLER_URL to your environment to enable this button.
        </p>
      )}

      <div className="dl-steps">
        <h3>After installing</h3>
        <ol>
          <li>Open StudyLock and sign in with your account.</li>
          <li>Pick the apps and programs to close during focus on the <Link to="/dashboard/blocklists">Blocklists</Link> page.</li>
          <li>Start a session, or set a <Link to="/dashboard/schedules">schedule</Link> so it starts on its own.</li>
        </ol>
        <p className="dl-cross">
          Also grab the <Link to="/extension">browser extension</Link> so distracting sites are covered too.
        </p>
      </div>

      <style>{`
        .content{max-width:var(--maxw);margin:0 auto;padding:clamp(2.5rem,6vw,4.5rem) clamp(1rem,4vw,2.5rem);}
        .content-head{max-width:56ch;margin-bottom:2.2rem;}
        .content-head h1{font-size:clamp(2rem,4.6vw,3rem);margin:1rem 0 .8rem;}
        .content-head p{color:var(--muted);font-size:1.05rem;}
        .dl-card{display:flex;align-items:center;gap:1.2rem;background:var(--ink-2);
          border:1px solid var(--line);border-radius:18px;padding:1.6rem;max-width:640px;flex-wrap:wrap;}
        .dl-ico{display:grid;place-items:center;width:60px;height:60px;border-radius:14px;
          background:rgba(142,123,243,.14);color:var(--lock);flex:none;}
        .dl-meta{flex:1;min-width:180px;}
        .dl-meta h3{font-size:1.2rem;margin-bottom:.3rem;}
        .dl-meta p{color:var(--muted);font-size:.82rem;}
        .content-note{color:var(--muted-2);font-size:.85rem;margin-top:1.2rem;font-family:'Space Mono',monospace;max-width:60ch;}
        .dl-steps{margin-top:2.6rem;max-width:600px;}
        .dl-steps h3{font-size:1.2rem;margin-bottom:.9rem;}
        .dl-steps ol{color:var(--muted);padding-left:1.2rem;line-height:2;}
        .dl-steps a{color:var(--lock);}
        .dl-cross{margin-top:1.2rem;color:var(--muted);font-size:.95rem;}
      `}</style>
    </section>
  );
}
