import { Brand, LockGlyph } from "../../components/ui";

export default function AuthShell({ title, sub, children }) {
  return (
    <div className="auth">
      <aside className="auth-side">
        <Brand />
        <div className="auth-side-body">
          <LockGlyph size={40} />
          <h2>Finish your work.<br />Earn your free time.</h2>
          <p>
            One account keeps your tasks, schedules, blocklists, and devices in
            sync across the Windows app, browser extension, and this dashboard.
          </p>
        </div>
        <span className="mono auth-side-foot">Plan it. Lock in. Get it done.</span>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          {sub && <p className="auth-sub">{sub}</p>}
          {children}
        </div>
      </main>

      <style>{`
        .auth{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
        .auth-side{background:linear-gradient(160deg,var(--ink-2),var(--ink-1));
          border-right:1px solid var(--line);padding:2rem;display:flex;flex-direction:column;
          justify-content:space-between;gap:2rem;}
        .auth-side-body{color:var(--lock);max-width:34ch;}
        .auth-side-body h2{color:var(--paper);font-size:2rem;margin:1.2rem 0 1rem;}
        .auth-side-body p{color:var(--muted);font-size:1rem;}
        .auth-side-foot{color:var(--muted-2);font-size:.78rem;}
        .auth-main{display:grid;place-items:center;padding:2rem 1.2rem;}
        .auth-card{width:100%;max-width:380px;}
        .auth-card h1{font-size:1.9rem;margin-bottom:.5rem;}
        .auth-sub{color:var(--muted);font-size:.95rem;margin-bottom:1.6rem;}
        .auth-or{display:flex;align-items:center;gap:.8rem;color:var(--muted-2);
          font-size:.8rem;margin:1.1rem 0;}
        .auth-or::before,.auth-or::after{content:"";flex:1;height:1px;background:var(--line);}
        .auth-alt{margin-top:1.4rem;text-align:center;color:var(--muted);font-size:.9rem;}
        .auth-alt a{color:var(--lock);font-weight:600;}
        @media(max-width:760px){.auth{grid-template-columns:1fr;}.auth-side{display:none;}}
      `}</style>
    </div>
  );
}
